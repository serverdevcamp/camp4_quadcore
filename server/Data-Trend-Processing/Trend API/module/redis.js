const redis = require('redis');
const client = redis.createClient(6379,'21.41.86.218');
// redis 접속 모듈화 
module.exports = {	
    set : async (...args) => {
        const key = args[0];
        const value= args[1];
        const db = args[2];
        const option = args[3]; // EX 설정해야 하는 경우 

        return new Promise ((resolve, reject) => {
            client.select(db);
            if(option) {
                client.setex(key, option , value, (err, response) => {
                    if(err) reject(err);
                    else resolve(response);
                });
            } else {
                client.set(key, value, (err, response) => {
                    if(err) reject(err);
                    else resolve(response);
                })
            }
        })
    },

    exists : async (...args) => {
        const key = args[0];
        const db = args[1];

        return new Promise ((resolve, reject) => {
            client.select(db);
            client.exists(key, (err, reply) => {
                if(err) reject(err);
                else resolve(reply);
            })
        })
    },
    get : async (...args) => {
        const key = args[0];
        const db = args[1];

        return new Promise ((resolve, reject) => {
            client.select(db);
            client.get(key, (err, reply) => {
                if(err) reject(err);
                else resolve(reply);
            })
        })
    },

    del : async (...args) => {
        const key = args[0];
        const db = args[1];

        return new Promise ((resolve, reject) => {
            client.select(db);
            client.del(key, (err, reply) => {
                if(err) reject(err);
                else resolve(reply);
            })
        })
    }
};