var express = require('express');
var router = express.Router();

//Trend hash tag 
router.use('/trend', require('./hashtagTrend'));
//Rank popular tweet 
router.use('/tweetRanking', require('./tweetRank'));

// router.get('/', async (req, res) => {
//     res.send('hello')
// });
module.exports = router;
