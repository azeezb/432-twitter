const express =  require('express'); 
const axios = require('axios');  
const router =  express.Router();


router.get('/', (req, res) => {

  axios({
    "method":"GET",
    "url":"https://movies-tvshows-data-imdb.p.rapidapi.com/",
    "headers":{
    "content-type":"application/octet-stream",
    "x-rapidapi-host":"movies-tvshows-data-imdb.p.rapidapi.com",
    "x-rapidapi-key":"7eee077375msh9974d1c7edaf9b2p195f97jsn0267e259a521",
    "useQueryString":true
    },"params":{
    "page":"1",
    "type":"get-trending-movies"
    }
    })
    .then((response)=>{
      const respo = response.data.movie_results;
      // console.log(respo)
      const topTen = respo.splice(0, 12);
    //   res.render('opening', { title: "Welcome" })
      res.render('index', {respo: topTen});
    })
    .catch((error)=>{
      console.log(error)
    })
  
});


module.exports = router;

//- app is router
//- api.js is server
//- netflix.js is client 



/// add the imdb thing to the index first, then get the netflix main celebrity working, then connect it to the avaialble movies on 
/// netflix. if that works find the latest tweets abouts the movie and main actor. 