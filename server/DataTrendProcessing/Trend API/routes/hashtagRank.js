const express = require('express');
const router = express.Router();

const redis = require('../module/redis');
const moment = require('moment');


// 실시간 해시태그 트렌드 보여주기 
router.get('/', async (req, res) => {
    let currentTime = moment().format("YYYY/MM/DD/HH/mm");
    let hashtag = 'hashtag';
    try {
        //result = await redis.get(currentTime, 1);
        result = await redis.get(hashtag, 1);
        console.log(result);
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

module.exports = router;