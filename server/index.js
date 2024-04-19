const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const { PubSub } = require('@google-cloud/pubsub');

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
    }
  });

const pubSub = new PubSub({
    projectId: 'leprojetsubv',
    keyFilename: './creds.json',
});

const topic = pubSub.topic('lucie');
const subscription = topic.subscription('lucie-sub');  

io.on('connection', (socket) => {
    console.log(`a user connected to the socket ${socket.id}`);

    // When a message is sent, publish it to the topic
    socket.on('send', (message) => {
        const data = JSON.parse(message);
        console.log(`Message: ${data.message} from ${data.author}`);
        topic.publishMessage({
            data: Buffer.from(data.message),
            attributes: {
                "author": data.author,
            }
        });
    });
});

// When a message is received, broadcast it to all connected clients
subscription.on('message', (message) => {
    message.ack();
    var data = {
        message: message.data.toString(),
        author: message.attributes.author
    };
    io.emit('pull', JSON.stringify(data));
});

httpServer.listen(8080);