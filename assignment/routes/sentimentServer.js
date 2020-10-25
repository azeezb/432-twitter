const Twit = require('twit');
const analyze = require('Sentimental').analyze;
const fs = require("fs");
const _ = require('lodash');
const stopwords = require('nltk-stopwords')
const sw = require('stopword')
const mostCommon = require('most-common');
const countWordsArray = require("count-words-array");
const { names } = require('debug');

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

var first=null;
var second=null;
var third=null;
var fourth=null;
var fifth=null;
var superstring;



const stopwordslit = ["i", "me", "https", "my", "RT", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself", "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself", "they", "them", "their", "theirs", "themselves", "what", "which", "who", "whom", "this", "t", "that", "these", "those", "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an", "the", "and", "but", "if", "or", "because", "as", "until", "while", "of", "at", "by", "for", "with", "about", "against", "between", "into", "through", "during", "before", "after", "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", "just", "don", "should", "now"]

// var WCDee = null;
var WDee = null;


function commontweet(tweets, total) {

    console.log('NUMBER OF TWEETS ' + tweets.length)

    for (let i = 1; i < tweets.length; i++) {
        superstring = superstring + ' ' + tweets[i].text;
    }    

    // console.log(superstring)

    var ranked = countWordsArray(superstring)

    // console.log(ranked)

    var namez = ranked.map(function(a) {return a.name;});
    var numberz = ranked.map(function(a) {return a.count;});
    
    // console.log(namez);
    // console.log(numberz)




    var counter=0;
    for (let i = 2; i < namez.length; i++) {
        var n = stopwordslit.includes(namez[i]);
        // if (n == false && namez[i].length > 4 && namez[i].length !== keywords) {
        if (n == false && namez[i].length > 4) {

            // console.log(namez[i])
            if(counter == 0){first = JSON.stringify([namez[i], numberz[i]])}
            if(counter == 1){second = JSON.stringify([namez[i], numberz[i]])}
            if(counter == 2){third = JSON.stringify([namez[i], numberz[i]])}
            if(counter == 3){fourth = JSON.stringify([namez[i], numberz[i]])}
            if(counter == 4){fifth = JSON.stringify([namez[i], numberz[i]])}           
            counter++;
        }
        if (counter == 5){break;} 
    }

    console.log(first);
    console.log(second);
    console.log(third);
    console.log(fourth);
    console.log(fifth);

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

  console.log(typeof keywords)

  
  let limit = req.query.limit;
  tweets = [];
  analysisResult = [];



  const blanksearch = 'Election';

  console.log('KEYWORD: ' + keywords.length)

  
  // If no keyword specified, use sample endpoint instead
  if (keywords.length < 1)
    stream = T.stream('statuses/filter', { track: blanksearch });
  else
    stream = T.stream('statuses/filter', { track: keywords });

  console.log('KEYWORD: ' + keywords)






  stream.on('tweet', (tweet) => {
    // Place the newest tweet in the first index
    tweets.unshift(tweet);

    // Only store the most recent 300 tweets streamed
    if (tweets.length > limit) {
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



            ///////////////////////////////////////////////////////
                                    //STREAM VALUE TO STORE
            //////////////////////////////////////////////////////
            // console.log(analysisResult);


 
            var WDee = JSON.stringify(createSentimentChartDatset(analysisResult));
            
            data = '[{"status":"Positive","amount":'+parseInt(positive)+'},{"status":"Negative","amount":'+parseInt(negative)+'}]'

            console.log("RESULT:" + positive + ", " + negative)

            var total = positive + negative

         
            // TWEET FREQUENCY ANALYSIS
            commontweet(tweets, total);
              

            fs.writeFile("../asgn2/public/data/sentiments.json", data, function(err, result) {
                if(err) console.log('error', err);
            });


            
            res.render('result', {
              keywords: keywords,
              limit: limit,
              total: total,
            //   wordCloudData: WCDee,
              chartData: WDee,
              tweets: tweets,
              first: first,
              second: second,
              third: third,
              fourth: fourth,
              fifth: fifth

            });
          });
      })
      .catch(error => {
        console.log('Error: ', error);
      });
  }, 5 * 1000);
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


