const express = require("express");
const anotherRouter2  = express.Router();
const axios = require("axios");



anotherRouter2.get("/netflix/:title", function (req, res) {

  const { title } = req.params;

  axios({
    "method":"GET",
    "url":"https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup",
    "headers":{
    "content-type":"application/octet-stream",
    "x-rapidapi-host":"utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com",
    "x-rapidapi-key":"7eee077375msh9974d1c7edaf9b2p195f97jsn0267e259a521",
    "useQueryString":true
    },"params":{
    "term":title,
    "country":"uk"
    }
    })
    .then((response)=>{
      const rsp3 = response.data;
      // console.log(rsp3)
      return res.json({ rsp3 });
    })
    .catch((error)=>{
      return res.json({"results":[{"locations":[{"display_name":"Netflix"}]}]});
    })
});

  
module.exports = anotherRouter2;
  






