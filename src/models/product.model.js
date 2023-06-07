'use strict'

const { model, Schema, Types } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

const productSchema = new Schema({
    product_name: { type: String, require: true },
    product_thumb: { type: String, require: true },
    product_description: String,
    product_quantity: { type: Number, require: true },
    product_type: { type: String, require: true, enum: ['Electronic', 'Clothing', 'Furniture'] },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    product_attributes: { type: Schema.Types.Mixed, require: true }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

const clothingSchema = new Schema({
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    brand: { type: String, require: true },
    size: String,
    material: String
}, {
    collection: "Clothes",
    timestamps: true
})

const electronicSchema = new Schema({
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    manufacturer: { type: String, require: true },
    model: String,
    color: String
}, {
    collection: "Electronics",
    timestamps: true
})

const funitureSchema = new Schema({
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    manufacturer: { type: String, require: true },
    model: String,
    color: String
}, {
    collection: "Furnitures",
    timestamps: true
})

//Export the model
module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    clothing: model("Clothing", clothingSchema),
    electronic: model("Electronic", electronicSchema),
    furniture: model("Furniture", funitureSchema),
}