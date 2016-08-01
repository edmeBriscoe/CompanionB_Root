var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(express);
var server = require('http').createServer(app);
var io = require('socket.io').listen(server); 
var mongoose = require('mongoose');
//var sd = require("./www/js/services/script");
//var routes = require("./www/js/services/routes"); 

//var routes = require("./www/js/services/routes"); 

server.listen(3000, function () {
    console.log('listening on : 3000.');
});

//These are the three new require statements needed to create the variables that Mongo needs for the connection and insert function
//Related documentation is available at https://docs.mongodb.com/getting-started/node/insert/
var assert = require('assert');
var ObjectID = require('mongodb').ObjectID;

// Connection URL for mLab
//var url = ' mongodb://inquiriesmyedmecom:CoreCompanion2016!@ds015444-a0.mlab.com:15444,ds015444-a1.mlab.com:15444/cherish?replicaSet=rs-ds015444'
// Connection URL that works for our hosted account on mongoDB
var url = 'mongodb://CoreCompanion:CoreCompanion2016!@cluster0-shard-00-00-31rcd.mongodb.net:27017,cluster0-shard-00-01-31rcd.mongodb.net:27017,cluster0-shard-00-02-31rcd.mongodb.net:27017/admin?ssl=true&replicaSet=Cluster0-shard-0';
// Use connect method to connect to the Server 
mongoose.connect(url,function(err){
    if(err)
    {
        console.log(err);
    }else{
        console.log("connected to mongodb");
    }
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {

    var scoreSchema = mongoose.Schema({
        email: { type: String, trim: true, lowercase: true },
        questionId: String,
        contextGrp1: String,
        score1: Number,
        studentResponse1: String,
        contextGrp2: String,
        score2: Number,
        studentResponse2: String,
        created: { type: Date, default: Date.now },
        update: { type: Date, default: Date.now }
    });

    //itemSchema.index({ email: 1 }, { unique: false });
    var Score = mongoose.model('Score', scoreSchema);
    
    io.sockets.on('connection', function(socket){
        console.log('connected to socket io');
        socket.on('new Score'), function(data){
            var newScore = new Score({
                email: data.email,
                questionId: data.questionId,
                contextGrp1: data.contextGrp1,
                score1: data.score1,
                studentResponse1: data.studentResponse1,
                contextGrp2: data.contextGrp2,
                score2: data.score2,
                studentResponse2: data.studentResponse2,
                createDate: data.createDate,
                updateAt: data.updateAt
            });

            newScore.save(function (err) {
                if (err)
                    throw err;
            });
        }
    })


});


//Our own code to handle bad URLs
// 