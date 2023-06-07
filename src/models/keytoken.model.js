'use strict';

const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = "Key"
const COLLECTION_NAME = "Keys"
// Declare the Schema of the Mongo model
const Schema = mongoose.Schema

var keyTokenSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: "Shop"
    },
    publicKey: {
        type: String,
        require: true,
    },
    refreshToken: {
        type: Array, default: [],
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true,
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, keyTokenSchema);