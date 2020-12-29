const path = require('path');
const express = require('express');
const volleyball = require('volleyball');
const api = require('./api');
const database = require('./database')
const utils = require('./hashingUtils')
//Redis can be used for Caching and Rate Limiting, it's a Key-Value store
const redis = require("redis").createClient()

redis.on("connect", function () {
  console.log('Redis Server Connected');
});

const app = express();
module.exports = app;

if (process.env.NODE_ENV !== 'test') {
  app.use(volleyball);
}
app.use(express.json());
app.use('/api', api);

//cahce in memory using Redis
//const cache = {}
app.get('/nocache/index.html', (req, res) => {
  database.get('index.html', page => {
    res.send(page + '\n')
  })
})

app.get('/withcache/index.html', (req, res) => {
  redis.get('index.html', (err, redisRes) => {
    if (redisRes) {
      res.send(redisRes);
      // if ('index.html' in cache) {
      //   res.send(cache['index.html']);
      return;
    }
    database.get('index.html', page => {
      //redis has a expiration parameter
      redis.set('index.html', page, 'EX', 10)
      //cache['index.html'] = page
      res.send(page + '\n')
    })
  })
})

// Rate Limiting: Keep a hash table of the previous access time for each user, store in memory
app.get('/ratelimiting/index.html', function (req, res) {
  const { user } = req.headers
  redis.get(user, (err, redisRes) => {
    if (redisRes) {
      const previouseAccessTime = redisRes
      //Limit to 1 request every 5 seconds
      if (Date.now() - previouseAccessTime < 5000) {
        //The HTTP 429 Too Many Requests response status code indicates the user has sent too many requests in a given amount of time ("rate limiting").
        res.status(429).send('Too many requests.\n');
        return;
      }
    }
    //Serve the page and store this access time
    database.get('index.html', page => {
      redis.set(user, Date.now())
      res.send(page + '\n')
    })
  })
})

// Load balancers using hasing functions
function pickServerRendezvous(username, servers) {
  let maxServer = null
  let maxScore = null
  for (const server of servers) {
    const score = utils.computeScore(username, server)
    if (maxScore === null || score > maxScore) {
      maxScore = score
      maxServer = server
    }
  }
  return maxServer
}
