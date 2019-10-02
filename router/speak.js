var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
var urlencodedParser = bodyParser.urlencoded({extended: false})
var jsonParser = bodyParser.json()
var amqp = require('amqplib/callback_api');

router.post('/',jsonParser,function(req,res){
    data = req.body
    amqp.connect('amqp://localhost', function(error0, connection){
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
              throw error1;
            }
            var key = data.key;
            var msg = data.msg;
        
            channel.assertExchange('hw4', 'direct', {
              durable: false
            });
            channel.publish('hw4', key, new Buffer(msg));//exchange, key, buffer
            console.log("Sent %s: '%s'", key, msg);
          });
        
          setTimeout(function() { 
            connection.close(); 
            process.exit(0) 
          }, 500);
    })
})

module.exports = router;