'use strict'

const { Types } = require('mongoose')
const { product } = require('../product.model')
const { getSelectData, getUnSelectData } = require('../../utils')

const findAllProductForShop = async ({ query, limit, skip }) => {
    return await product.find(query).
        populate('product_shop', 'name email -_id').
        sort({ updateAt: -1 }).
        skip(skip).
        limit(limit).
        lean().
        exec()
}

const findAllDraftsForShop = async ({ query, limit, skip }) => {
    return await findAllProductForShop({ query, limit, skip })
}

const findAllPublishedForShop = async ({ query, limit, skip }) => {
    return await findAllProductForShop({ query, limit, skip })
}

const findAllProduct = async ({ limit, sort, page, filter, select }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { id: -1 } : { id: 1 }
    const products = await product.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()

    return products.length > 0 ? products : "Have no product in db"
}

const findOneProduct = async ({ product_id, unSelect }) => {
    return await product.findById(product_id)
        .select(getUnSelectData(unSelect))
}

const publishProductByShop = async ({ product_shop, product_id }) => {
    const foundProduct = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })

    if (!foundProduct) return null

    foundProduct.isPublished = true
    foundProduct.isDraft = false
    console.log(`foundProduct::`, foundProduct)

    const { modifiedCount } = await foundProduct.updateOne(foundProduct)
    return modifiedCount
}

const unpublishProductByShop = async ({ product_shop, product_id }) => {
    const foundProduct = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })

    if (!foundProduct) return null

    foundProduct.isPublished = false
    foundProduct.isDraft = true
    console.log(`foundProduct::`, foundProduct)

    const { modifiedCount } = await foundProduct.updateOne(foundProduct)
    return modifiedCount
}

const searchProductByUser = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch)
    const results = await product.find({
        isDraft: false,
        $text: { $search: regexSearch }
    },
        { score: { $meta: 'textScore' } }
    )
        .sort({ score: { $meta: 'textScore' } })
        .lean()

    return results
}
module.exports = {
    findAllDraftsForShop,
    findAllPublishedForShop,
    findAllProduct,
    findOneProduct,
    publishProductByShop,
    unpublishProductByShop,
    searchProductByUser
}