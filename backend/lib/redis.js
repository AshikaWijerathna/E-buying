import Redis from "ioredis"
import dotenv from "dotenv"

dotenv.config()

export const redis = new Redis(process.env.UPSTASH_REDIS_URL, {
    retryStrategy(times){
        //reconnect after
        return Math.min(times * 50, 2000);
    },
    reconnectOnError(error){
        const targetError = "READONLY";
        if(error.message.includes(targetError)){
            //retry reconnect
            return true;
        }
    }
});
//key-value store
await redis.set('foo', 'bar');