const express = require("express");
const anotherRouter4  = express.Router();
const axios = require("axios");

var Twitter = require('twitter');


anotherRouter4.get("/twitter/:title", function (req, res) {

  const { title } = req.params;

  // console.log("pass variable10 " + title)

  var client = new Twitter({
    consumer_key: 'SIbO0O0WJj4yCC0QGqPCNT7im',
    consumer_secret: '7JO13P6YoecZek6kwSxRCL6l8LHt6WobwI1jFj7iT3pTOe69OO',
    access_token_key: '888043051360202753-kD2xmmB9Kjeaeva4W6PSYaQffqLff7l',
    access_token_secret: 'kLcuUD4nXrAkEItXPRQkhPhKrHP7XSnxu2xxcfHFNMce2'
  });
  
  client.get('search/tweets.json', {q: title, count: 7, lang: "en", result_type: "mixed"}, function(error, tweets, response) {

    const rsp4 = tweets;
    // console.log(rsp4)
    return res.json({ rsp4 });

  });
  
});


  
module.exports = anotherRouter4;
  
