var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var amqp = require('amqplib/callback_api');

var listen = require("./router/listen.js")
var speak = require("./router/speak.js")

app.use('/listen', listen)
app.use('/speak', speak)

amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    if (error1) {
        throw error1;
    }
    ch.assertExchange('hw4', 'direct', {durable: false})

  });
  
});

app.listen(3000)