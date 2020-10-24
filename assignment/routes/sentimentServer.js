const Twit = require('twit');
const analyze = require('Sentimental').analyze;
const fs = require("fs");
const _ = require('lodash');
const ObjectsToCsv = require('objects-to-csv')

/**
 * Create a twitter stream helper
 */
var T = new Twit({
    consumer_key: 'SIbO0O0WJj4yCC0QGqPCNT7im',
    consumer_secret: '7JO13P6YoecZek6kwSxRCL6l8LHt6WobwI1jFj7iT3pTOe69OO',
    access_token: '888043051360202753-kD2xmmB9Kjeaeva4W6PSYaQffqLff7l',
    access_token_secret: 'kLcuUD4nXrAkEItXPRQkhPhKrHP7XSnxu2xxcfHFNMce2',
    timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests. 
});

var stream;
var keywords = null;
var tweets = [];
var analysisResult = [];



var WCDee = null;
var WDee = null;


function commontweet(tweets) {
    console.log("This is..." + tweets[0]);
}




/**
 * GET /
 * Result page.
 */
exports.result = (req, res) => {
  // Stop existing stream
  if (keywords && stream) {
    stream.stop();
  }
  keywords = req.query.keywords;
  let limit = req.query.limit;
  tweets = [];
  analysisResult = [];

  // If no keyword specified, use sample endpoint instead
  if (keywords.length > 0)
    stream = T.stream('statuses/filter', { track: keywords });
  else
    stream = T.stream('statuses/sample', { language: 'en' });

  stream.on('tweet', (tweet) => {
    // Place the newest tweet in the first index
    tweets.unshift(tweet);

    // Only store the most recent 300 tweets streamed
    if (tweets.length > 300) {
      tweets.pop();
    }

    // If analysis result execeeds user specified limit, remove the oldest result
    if (analysisResult >= limit) {
      addAndPop(analysisResult, analyze(tweet.text));
    }
  });

  // Stop the stream during unexpected request failure
  req.on('close', () => {
    stream.stop();
  });
  
  // Start analyzing streamed tweets after specified seconds
  setTimeout(() => {
    tweets.forEach(function (tweet) {
      analysisResult.unshift(analyze(tweet.text));
    }, this);


    readLocalTweets('public/data/sample_tweets.txt')
      .then(data => {
        let unfilteredSample = data.toString().split('\n');
        filterLocalTweets(keywords, unfilteredSample, analysisResult.length, limit)
          .then(filteredSample => {
            for (i in filteredSample) {
              analysisResult.push(analyze(filteredSample[i]));
              if (analysisResult.length >= limit) break;
            }



            var WCDee = JSON.stringify(createWordCloudDataset(analysisResult).slice(0, 30));
            var WDee = JSON.stringify(createSentimentChartDatset(analysisResult));
            
            data = '[{"status":"Positive","amount":'+parseInt(positive)+'},{"status":"Negative","amount":'+parseInt(negative)+'}]'

            console.log("RESULT:" + positive + ", " + negative)


            fs.writeFile("../asgn2/public/data/sentiments.json", data, function(err, result) {
                if(err) console.log('error', err);
            });


            commontweet(tweets);
            
            res.render('result', {
              keywords: keywords,
              limit: limit,
              wordCloudData: WCDee,
              chartData: WDee,
              tweets: tweets
              
            });
          });
      })
      .catch(error => {
        console.log('Error: ', error);
      });
  }, 5 * 1000);
};

/**
 * Endpoint for receiving updated data
 * Called after intial result is shown
 */
exports.intervalData = (req, res) => {
  let chartData = createSentimentChartDatset(analysisResult);
  let wordCloudData = createWordCloudDataset(analysisResult).slice(0, 30);
  let streamedTweets = tweets;

  res.json({
    chartData: chartData,
    wordCloudData: wordCloudData,
    tweets: streamedTweets
  });
}

/**
 * Generate and return a non-duplicate array for word cloud based on analysed sentimental result
 * @param {*array} result 
 */
var createWordCloudDataset = (analysisResult) => {
  let array = [];
  analysisResult.forEach(function (element) {
    array = array.concat(element.positive.words, element.negative.words);
  }, this);

  return _.uniq(array);
};

var positive = 0;
var negative = 0;

/**
 * Generate and return an array containing positive tweet counts and negative tweet counts
 * @param {*array} analysisResult 
 */
var createSentimentChartDatset = (analysisResult) => {
  let posCount = 0;
  let negCount = 0;
  analysisResult.forEach(function (element) {
    if (element.score < 0) negCount++;
    else if (element.score > 0) posCount++;
  }, this);

  console.log([posCount, negCount]);

  positive = parseInt(posCount)
  negative = parseInt(negCount)

  return [posCount, negCount];
};

/**
 * Return a promise of an asynchronous file read from specified file path
 * @param {*string} filePath 
 */
var readLocalTweets = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      return err ? reject(err) : resolve(data);
    });
  });
};

/**
 * Filter out the local sample tweets based on input keywords
 * @param {*string} keywords 
 * @param {*string} sample 
 */
var filterLocalTweets = (keywords, sample) => {
  return new Promise((resolve, reject) => {
    keywords = keywords.split(',');

    let filteredTweet = [];

    if (keywords.length > 0) {
      sample.forEach(function (tweet) {
        let matched = false;
        keywords.forEach(function (keyword) {
          if (_.includes(tweet.toLowerCase(), keyword.toLowerCase())) {
            filteredTweet.push(tweet);
          }
        }, this);
      }, this);
      return resolve(_.uniq(filteredTweet));
    } else {
      return resolve(sample);
    }
  });
}

/**
 * Add element to the array to the first index and remove the oldest entry
 * @param {*} x 
 */
var addAndPop = (list, element) => {
  list.unshift(element);
  list.pop();
}


