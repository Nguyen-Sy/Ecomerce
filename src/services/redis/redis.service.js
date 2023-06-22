"use strict";

const redis = require("redis");
const { promisify } = require("util");

const redisClient = redis.createClient();

const pexpire = promisify(redisClient.pExpire).bind(redisClient);
const setnxAsync = promisify(redisClient.setNX).bind(redisClient);

const acquireLock = async (productId, quantity, cartId) => {
    const key = `lock_shop_${productId}`;
    const retryTimes = 10;
    const expireTime = 3000;

    for (let i = 0; i < retryTimes; i++) {
        const result = await setnxAsync(key, expireTime);
        console.log(`result:: `, result);

        if (result === 1) {
            return key;
        } else {
            await new Promise((resolve) => setTimeout(resolve, 50));
        }
    }
};

const releaseLock = async (keyLock) => {
    const delAsyncKey = promisify(redisClient.del).bind(redisClient);
    return await delAsyncKey(keyLock);
};

module.exportss = {
    acquireLock,
    releaseLock,
};
