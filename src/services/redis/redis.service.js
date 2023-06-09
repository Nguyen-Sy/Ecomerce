"use strict";

const redis = require("redis");
const { promisify } = require("util");
const {
    reservationInventory,
} = require("../../models/repository/inventory.repo");

const redisClient = redis.createClient();

redisClient.ping((err, result) => {
    if (err) {
        console.error("Error connecting to redis", err);
    } else {
        console.log("Connecting to redis");
    }
});

const acquireLock = async ({ productId, quantity, cartId }) => {
    const pexpire = promisify(redisClient.pexpire).bind(redisClient);
    const setnxAsync = promisify(redisClient.setnx).bind(redisClient);

    const key = `lock_shop_${productId.toString()}`;
    const retryTimes = 10;
    const expireTime = 3000;

    for (let i = 0; i < retryTimes; i++) {
        const result = await setnxAsync(key, expireTime);
        console.log(`result:: `, result);

        if (result === 1) {
            const isReservation = await reservationInventory({
                productId,
                quantity,
                cartId,
            });
            if (isReservation.modifiedCount) {
                await pexpire(key, expireTime);
                return key;
            }
            console.log(isReservation);
            return null;
        } else {
            await new Promise((resolve) => setTimeout(resolve, 50));
        }
    }
};

const releaseLock = async (keyLock) => {
    const delAsyncKey = promisify(redisClient.del).bind(redisClient);
    return await delAsyncKey(keyLock);
};

module.exports = {
    acquireLock,
    releaseLock,
};
