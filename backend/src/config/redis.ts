import Redis from "ioredis";


const redisConfig = {
     host: process.env.REDIS_HOST || 'localhost',
     port: parseInt(process.env.REDIS_PORT || '6379', 10),
     password: process.env.REDIS_PASSWORD || undefined,
};

const redisClient = new Redis(redisConfig);

redisClient.on('connect',()=>{
     console.log('REDIS CONNECTION SUCCESSFUL');
});

redisClient.on('error',(err)=>{
     console.error('REDIS CONNECTION FAILED',err);
});

export default redisClient;