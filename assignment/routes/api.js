const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/posters/:title", function (req, res) {
  
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
      "type":"get-movies-images-by-imdb"
      }
      })
      .then((response)=>{
        const rsp = response.data;
        return res.json({ rsp });      
      })
      .catch((error)=>{
        return res.json({"rsp":{"poster":"nothing"}});
      })


});


module.exports = router;
