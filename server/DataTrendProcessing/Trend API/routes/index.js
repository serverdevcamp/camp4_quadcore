var express = require('express');
var router = express.Router();

//Trend hash tag 
router.use('/hashtag', require('./hashtagRank'));
//Rank popular tweet 
router.use('/tweet', require('./tweetRank'));

module.exports = router;
