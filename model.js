const mongoose = require('mongoose');

const keySchema = new mongoose.Schema({
    key: String,
    status:Boolean,
    use:Boolean,
    expireAt: Date,
});

keySchema.index({expireAt: 1}, {expireAfterSeconds: 0});

module.exports =  mongoose.model('Key',keySchema);