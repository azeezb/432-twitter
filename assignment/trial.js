// Import the installed modules.
const express = require('express');
const responseTime = require('response-time')
const axios = require('axios');
const redis = require('redis');



const app = express();

const redisClient = redis.createClient();  

redisClient.on('error', (err) =>  {    
    console.log ("Error " + err );  
});

app.use(responseTime());

app.get('/api/search', (req , res) => {
    const query = (req.query.query).trim()


    // Construct the wiki URL and key
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=parse&format=json&section=0&page=${query}`;
    const redisKey = `wikipedia:${query}`;

    // Try the cache
    return redisClient.get(redisKey, (err, result) => {
        if (result) {
    
        // Serve from Cache
        const resultJSON = JSON.parse(result);
        return res.status(200).json(resultJSON);
    } else {
       // Serve from Wikipedia API and store in cache
        return axios.get(searchUrl)
            .then(response => {
                const responseJSON = response.data;
                redisClient.setex(redisKey, 3600, JSON.stringify({ source: 'Redis Cache', ...responseJSON, }));
                return res.status(200).json({ source: 'Wikipedia API', ...responseJSON, });
                })
                .catch(err => {
                    return res.json(err);
                });
        }
    });
});

app.listen(3000, () => {
    console.log('Server listening on port: ', 3000);
});







































