import redisClient from "../../config/redis";

export const cacheData = async<T>(
     key:string,
     data:T,
     titleSeconds:number
):Promise<void> =>{
     try {
         await redisClient.set(
          key,
          JSON.stringify(data),
          'EX',
          titleSeconds
         ) 
     } catch (error) {
          console.error('REDIS SET FAILED:',error);
     }
};


export const getCachedData = async <T>(
  key: string
): Promise<T | null> => {
  try {
    const data = await redisClient.get(key);
    if (!data) return null;

    return JSON.parse(data) as T;
  } catch (error) {
    console.error('Redis GET failed:', error);
    return null;
  }
};


export const deleteCachedData = async (key: string): Promise<void> => {
  try {
    await redisClient.del(key);
  } catch (error) {
    console.error('Redis DEL failed:', error);
  }
};