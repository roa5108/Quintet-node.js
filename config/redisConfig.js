const redis = require('redis');
const dotenv = require('dotenv');
dotenv.config();

const client = redis.createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    },
    legacyMode: true
});

client.on('connect', () => {
    console.log('redisConfig 연결에 성공했습니다.');
});
client.on('error', (err) => {
    console.log('redisConfig 연결 중 에러가 발생했습니다.', err);
});
client.connect().then();

const redisClient = client.v4;

module.exports = redisClient;