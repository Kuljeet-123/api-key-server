const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const JSON = require('json');
const mongoose = require('mongoose');

const keySchema = require('../model');

const createKey = () => crypto.randomBytes(32).toString('hex');

const url = 'mongodb://localhost:27017/keyStore';

mongoose.connect(url,{useCreateIndex:true,useNewUrlParser:true,useUnifiedTopology:true}).then(() =>{
    console.log("Mongoose connected");
})


const keyServer = express.Router();

keyServer.use(bodyParser.json());

keyServer
.get('/status',(req,res,next) => {
    res.statusCode = 200;
    res.end(`server is running`);
});

keyServer
.get('/generate',(req,res,next) => {
    const key = createKey();
    const keyData = new keySchema({
        key: key,
        status: true,
        use: false,
        expireAt: Date.now() + 5*60*1000})
    keyData.save().then((result) => {
        console.log(result.key);
        res.statusCode = 201;
        res.end(`${result.key}`);
    })
    .catch(err => res.status(500).end(err.message));
});

keyServer
.get('/get-key',(req,res,next) => {
    keySchema.find({
        use: false
    }, (err, result) => {
        console.log(result);
        if(err) {
            return res.status(404).end('Key Not Found');
        }
        keySchema.updateOne({
            key: result[0].key
        }, { use: true }).then(
            () => {
                res.statusCode = 200;
        return res.end(`${result[0].key}`);
            }
        );
    })
    .limit(1)
    .lean();
});

keyServer
.post('/update-key',(req,res,next) => {
    const key = req.body.key;
    if(!key){
        res.status(204).end('Invalid Key');
    }
    else if(key)
    {
        keySchema.updateOne({
            key: key},
            {expireAt: Date.now() + 5*60*1000}
        ).then(
            res.status(200).end('Updated Succesfully')
        )
    }
    else
    {
        res.status(204).end('Please pass the valid key in POST parameters');
    }
});

keyServer
.post('/delete-key',(req,res,next) => {

    const key = req.body.key;
    if(!key){
        res.status(204).end('Invalid Key');
    }
    else if(key)
    {
        keySchema.deleteOne({
            key:key}
        ).then(
            res.status(200).end('Deleted Succesfully')
        )
    }
    else
    {
        res.status(204).end('Please pass the valid key in POST parameters');
    }
});

keyServer
.post('/unblock-key',(req,res,next) => {
    const key = req.body.key;
    if(!key){
        res.status(204).end('Invalid Key');
    }
    else if(key)
    {
        keySchema.updateOne({
            key: key},
            {use:false}
        ).then(
            res.status(200).end('Key unblocked successfully!')
        )
    }
    else
    {
        res.status(204).end('Please pass the valid key in POST parameters');
    }
});


module.exports = keyServer;