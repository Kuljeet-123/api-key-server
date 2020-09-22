### Simple Key Server

Simple server for Key management. Command to run the app - "node index.js"

Port used 8080

### Endpoints supported

	-	GET /status : To get the status of the server, keys generated, blocked keys with time details

	-	GET /generate : To generate new key

	-	GET /get-key : To get random key from available(unblocked) key list. 404 error if no key available

	-	POST /update-key : To keep alive the particular key. Accepts JSON body with "key" as parameters

	-	POST /unblock-key : To unblock the particular key. Accepts JSON body with "key" as parameters

	-DELETE /delete-key : To delete the particular key. Accepts JSON body with "key" as parameters
