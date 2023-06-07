'use strict';
const { countConnect } = require("../helpers/check.connect")
const mongoose = require('mongoose');
const { db: { host, name, port } } = require('../configs/config.mongodb')
const connectionString = `mongodb://${host}:${port}/${name}`

class Database {

    constructor() {
        this.connect()
    }

    connect(type = 'mongodb') {
        if (1 === 1) {
            mongoose.set('debug', true)
            mongoose.set('debug', { color: true })
        }
        mongoose.connect(connectionString)
            .then(_ => {
                console.log('Connected to Mongo')
                countConnect()
            })
            .catch(err => console.log(err))
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database()
        }

        return Database.instance
    }
}

const instanceMongoDb = Database.getInstance()
module.exports = instanceMongoDb