const express = require('express');
const router = express.Router();

const redis = require('../module/redis');
const moment = require('moment');


// 실시간 인기 트윗 랭킹 보여주기 
router.get('/', async (req, res) => {
    console.log('hello');
    //let currentTime = moment().format("YYYY/MM/DD/HH/mm");
    let tweetRank = 'tweetRank';
    try {
        result = await redis.get(tweetRank, 2);
        //console.log(result);
        if(!result) {
            res.status(200).send({
                state : 'fail',
                errorCode : 40,
                message : 'there is no data'
            })
        } else {
            res.status(200).send({
                state : 'success',
                errorCode : 10,
                message : result
            })
        }
    } catch(err) {
        res.status(200).send({
            state : 'fail',
            errorCode : 52,
            message : err
        })
    }
});

// 과거 인기 랭킹 목록 조회 
router.post('/', async (req, res) => {
    let time = req.body.time; // 조회할 시간 
    try {
        result = await redis.get(time, 0);
        //console.log(result);
        if(!result) {
            res.status(200).send({
                state : 'fail',
                errorCode : 40,
                message : 'there is no data'
            })
        } else {
            res.status(200).send({
                state : 'success',
                errorCode : 10,
                message : result
            })
        }
    } catch(err) {
        res.status(200).send({
            state : 'fail',
            errorCode : 52,
            message : err
        })
    }
})
module.exports = router;