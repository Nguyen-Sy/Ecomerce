'use strict'

const { product, furniture, clothing, elctronic } = require("../models/product.model")
const { BadRequestError } = require("../core/error.respone")
const { findAllDraftsForShop,
    findAllPublishedForShop,
    publishProductByShop,
    unpublishProductByShop,
    searchProductByUser,
    findAllProduct,
    findOneProduct } = require('../models/repository/product.repo')

class ProductFactory {
    // type: enum: ['Clothing', 'Electronic', 'Funiture']
    static productRegistry = {}

    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef
    }

    static async createProduct(type, payload) {

        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw BadRequestError(`Invalid product type:: ${type}`)

        return new productClass(payload).createProduct()
    }


    //Put
    static async publishProductByShop({ product_shop, product_id }) {
        return await publishProductByShop({ product_shop, product_id })
    }

    static async unpublishProductByShop({ product_shop, product_id }) {
        return await unpublishProductByShop({ product_shop, product_id })
    }

    //Query
    static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true }
        return await findAllDraftsForShop({ query, limit, skip })
    }

    static async findAllPublishedForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublished: true }
        return await findAllPublishedForShop({ query, limit, skip })
    }

    static async searchProduct({ keySearch }) {
        return await searchProductByUser({ keySearch })
    }

    static async findAllProducts({ limit = 50, sort = 'ctime', page = 1, filter = { isPublished: true } }) {
        return await findAllProduct({
            limit, sort, page, filter,
            select: ['product_name', 'product_thumb', 'product_price']
        })
    }

    static async findOneProduct({ product_id }) {
        return await findOneProduct({
            product_id, unSelect: ['__v']
        })
    }
}

class Product {
    constructor({
        product_name, product_thumb, product_description, product_price,
        product_type, product_shop, product_attributes, product_quantity
    }) {
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_description = product_description
        this.product_price = product_price
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
        this.product_quantity = product_quantity
    }

    async createProduct(product_id) {
        return await product.create({ ...this, _id: product_id })
    }
}

// defined sub-class for different product type clothing

class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newClothing) throw new BadRequestError('create new Clothing error')

        const newProduct = await super.createProduct(newClothing._id)
        if (!newProduct) throw new BadRequestError('create new product error')

        return newProduct
    }

    async updateProduct(productId) {

    }
}

class Electronic extends Product {
    async createProduct() {
        const newElectronic = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newElectronic) throw new BadRequestError('create new Electronic error')

        const newProduct = await super.createProduct(newElectronic._id)
        if (!newProduct) throw new BadRequestError('create new product error')

        return newProduct
    }
}

class Funiture extends Product {
    async createProduct() {
        const newFuniture = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newFuniture) throw new BadRequestError('create new Funiture error')

        const newProduct = await super.createProduct(newFuniture._id)
        if (!newProduct) throw new BadRequestError('create new product error')

        return newProduct
    }
}

ProductFactory.registerProductType("Clothing", Clothing)
ProductFactory.registerProductType("Electronic", Electronic)
ProductFactory.registerProductType("Funiture", Funiture)

module.exports = ProductFactory