/*********************************
 * HTTPS HANDLER
 *********************************/
var httpsMode = "disable"; // "enable" or "disable"

// SSL paths (required only if httpsMode = "enable")
var sslServerKeyFile = '/etc/letsencrypt/live/rbnb.cd/privkey.pem';
var sslServerCrtFile = '/etc/letsencrypt/live/rbnb.cd/cert.pem';
var sslBundleServerCrtFile = '/etc/letsencrypt/live/rbnb.cd/fullchain.pem';

var express = require('express');
var http = require('http');
var https = require('https');
var fs = require('fs');
var { Server } = require('socket.io');

var app = express();
var server;

/*********************************
 * CREATE HTTP / HTTPS SERVER
 *********************************/
if (httpsMode === "enable") {

    server = https.createServer({
        key: fs.readFileSync(sslServerKeyFile),
        cert: fs.readFileSync(sslServerCrtFile),
        ca: fs.readFileSync(sslBundleServerCrtFile)
    }, app);

} else {

    server = http.createServer(app);
}

/*********************************
 * SOCKET.IO (NODE 25 + v4)
 *********************************/
var io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
    transports: ["websocket"]
});

/*********************************
 * SOCKET EVENTS (LOGIC SAME)
 *********************************/
io.on('connection', function (client) {

    console.log("New client connected:", client.id);

    client.on('join', function (data) {
        console.log('Join room:', data.joinId);
        client.join('/normal/' + data.joinId);
    });

    client.on('message', function (data) {

        console.log(
            'inquiry ' + data.inquiryId +
            ' receiver ' + data.receiverId +
            ' sender ' + data.senderId +
            ' message ' + data.message +
            ' listing ' + data.listingId
        );

        io.to('/normal/' + data.inquiryId).emit('message', {
            inquiry: data.inquiryId,
            receiver: data.receiverId,
            sender: data.senderId,
            listing: data.listingId,
            message: data.message
        });
    });

    client.on('messageTyping', function (data) {

        console.log(
            'Typing:',
            data.inquiryId,
            data.senderId,
            data.receiverId,
            data.message,
            data.listingId
        );

        io.to('/normal/' + data.inquiryId).emit('messageTyping', {
            receiver: data.receiverId,
            sender: data.senderId,
            listing: data.listingId,
            message: data.message
        });
    });

    client.on('disconnect', function () {
        console.log("Client disconnected:", client.id);
    });
});

/*********************************
 * START SERVER
 *********************************/
server.listen(8081, function () {
    console.log('Socket server running on port 8081');
});
