'use strict'

const { model, Schema, Types } = require('mongoose'); // Erase if already required
const { default: slugify } = require('slugify');

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

const productSchema = new Schema({
    product_name: { type: String, require: true },
    product_thumb: { type: String, require: true },
    product_description: String,
    product_quantity: { type: Number, require: true },
    product_type: { type: String, require: true, enum: ['Electronic', 'Clothing', 'Furniture'] },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    product_attributes: { type: Schema.Types.Mixed, require: true },
    product_slug: String,
    product_ratingAverage: {
        type: Number,
        default: 4.5,
        min: [1, "Rating must be above 1.0"],
        max: [5, "Rating must be below 5,0"],
        set: (val) => Math.floor(val * 10) / 10
    },
    product_varitations: { type: Array, default: [] },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});
// Create index for search
productSchema.index({ product_name: 'text', product_description: 'text' })

// Document middleware: runs before save(),...
productSchema.pre('save', function (next) {
    this.product_slug = slugify(this.product_name, { lower: true })
    next()
})

// Define product type
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