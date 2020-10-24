const express = require("express");
const anotherRouter  = express.Router();
const axios = require("axios");



anotherRouter.get("/description/:title", function (req, res) {

  const { title } = req.params;

  axios({
    "method":"GET",
    "url":"https://movies-tvshows-data-imdb.p.rapidapi.com/",
    "headers":{
    "content-type":"application/octet-stream",
    "x-rapidapi-host":"movies-tvshows-data-imdb.p.rapidapi.com",
    "x-rapidapi-key":"7eee077375msh9974d1c7edaf9b2p195f97jsn0267e259a521",
    "useQueryString":true
    },"params":{
    "imdb":title,
    "type":"get-movie-details"
    }
    })
    .then((response)=>{
      const rsp2 = response.data;
      // console.log(rsp2)
      return res.json({ rsp2 });
    })
    .catch((error)=>{
      return res.json({"rsp2":{"description":"nothing"}});
    })
});


  
module.exports = anotherRouter;
  
