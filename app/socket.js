/* Becuase we will be reading some file we need file system module */
var fs = require("fs");

//Including twit npm module
var Twit = require('twit')

/* Log that we are starting */
console.log("Starting");

/* Using JSON config file to define host and port */
var host = "0.0.0.0"
var port = 3020

/* Including express framework */
var express = require("express");
var mongoose = require('mongoose');
/* API keys */
var secrets = require('./config/secrets');

/* Creating server */
var app = express();

/**
 * Connect to MongoDB.
 */
mongoose.connect(secrets.db);
mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});

var db = mongoose.createConnection(secrets.db);

/* Specify individual paths and each path will have it's own callback */
/* Root path */
app.get("/",function (request,response){
    //Reading contents of html file
    var content = fs.readFileSync("template.html");

    //get tweets
    getTweets(function(tweets){
        var ul = '';
        //Creating an unordered list with tweets 
        tweets.forEach(function(tweet){
            ul += '<li><strong>' + tweet.user.screen_name + ": </strong>" + tweet.text + "</li>";
        });
        //Assigning back to itself 
        content = content.toString("utf8").replace("{{INITIAL_TWEETS}}",ul);
        //Set custom header
        response.setHeader("Content-type","text/html");
        response.send(content);
    });
});


/* Similar to http callback */
//app.listen(port,host); 
//EXPRESS API has been changed reference http://stackoverflow.com/questions/10191048/socket-io-js-not-found
var http = require('http');

var server = http.createServer(app);

var io = require('socket.io').listen(server);

server.listen(port);

/* Above code working fine now socket.io working fine */
//using socket io with express web server
//var io = require('socket.io').listen(app);

//Variable to store table name
var tweetCollection;

db.on('error', function(err){
    console.log("mongoose connection error: " + err );
});

db.once('open', function(){
    console.log("OPEN MONGO CONNECTION");
    mongoose.connection.db.collection("tweet", function (err, collection){
        tweetCollection = collection
    });
});

//function to get last 10 tweets
function getTweets(callback){
    //Adding empty object {} as we want all the results
    tweetCollection.find({},{"limit":10,"sort":{"_id":-1}},function(error,cursor){
        cursor.toArray(function(error,tweets){
            callback(tweets);
        });
    });
}

/* Code that connect with twitter and streams data into database */

//Defining access tokens, Get this by creating new twitter application
var T = new Twit({
    consumer_key:           secrets.twitter.consumerKey,
    consumer_secret:      secrets.twitter.consumerSecret,
    access_token:         "4032818050-gg2RdldEmDT9UAJmi7oQBs9UrNg1NwjMjrorbLo",
    access_token_secret:  "R3J1BgrLSUcYayHMXSXpYtlf03wBqF0nBumGa8NgBHy8S"
})

//Creating a request variable and using stream function 
var request = T.stream('statuses/filter', { track: 'fixitkw' })

//Printing tweets related to bieber on a screen 
request.on('tweet', function (tweet) {
    //Every client which is connected to our website is included in sockets
    //emit is to send data to client,We supplied tweet(json) as js object
    //Sockets will serialise tweet which is deserialised at client(template.html)
    io.sockets.emit("tweet",tweet);
    /*
    tweetCollection.insert(tweet,function(error){
        if(error){
            console.log(error);
        }else{
            console.log("Inserted into database");
        }
    });
    */
    console.log(tweet.text);
    console.log("\n");
})

//request.end(); 




