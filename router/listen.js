var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
var urlencodedParser = bodyParser.urlencoded({extended: false})
var jsonParser = bodyParser.json()
var amqp = require('amqplib/callback_api');

router.post('/',jsonParser,function(req,res){
    data = req.body
    amqp.connect('amqp://localhost', function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }

            channel.assertExchange("hw4", 'direct', {
                durable: false
            });

            channel.assertQueue('', {exclusive: true}, function(error2, q) {
                if (error2) {
                    throw error2;
                }
                console.log('Listening...');
                key = data.keys
                console.log(key.toString());
                for(var i = 0;i<key.length; i++){
                    channel.bindQueue(q.queue, "hw4", key[i]);
                }
                channel.consume(q.queue, function(msg) {
                    console.log("%s: '%s'", msg.fields.routingKey, msg.content.toString());
                    res.json({'msg': msg.content.toString()})
                });
            });
        });
    });
})

module.exports = router;