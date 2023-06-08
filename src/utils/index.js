"use strict";

const _ = require("lodash");
const crypto = require("crypto");
const url = require("node:url");

const createPublicAndPrivateKey = () => {
    return crypto.generateKeyPairSync("rsa", {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: "pkcs1",
            format: "pem",
        },
        privateKeyEncoding: {
            type: "pkcs1",
            format: "pem",
        },
    });
};

const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields);
};

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map((el) => [el, 1]));
};

const getUnSelectData = (select = []) => {
    return Object.fromEntries(select.map((el) => [el, 0]));
};
const fullUrl = (req) => {
    return url.format({
        protocol: req.protocol,
        host: req.get("host"),
        pathname: req.originalUrl,
    });
};

const updateNestedObjParse = (obj) => {
    const final = {};
    Object.keys(obj).forEach((k) => {
        if (typeof obj[k] === "object" && !Array.isArray(obj[k])) {
            const res = updateNestedObjParse(obj[k]);
            Object.keys(res).forEach((a) => {
                final[`${k}.${a}`] = res[a];
            });
        } else {
            final[k] = obj[k];
        }
    });
    return final;
};

const removeUndefindedObject = (obj) => {
    Object.keys(obj).forEach((k) => {
        if (obj[k] === null || typeof obj[k] === "undefined") {
            delete obj[k];
        }
    });

    return obj;
};

module.exports = {
    getInfoData,
    createPublicAndPrivateKey,
    fullUrl,
    getSelectData,
    getUnSelectData,
    updateNestedObjParse,
    removeUndefindedObject,
};
