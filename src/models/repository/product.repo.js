'use strict'

const { Types } = require('mongoose')
const { product } = require('../product.model')

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
    publishProductByShop,
    unpublishProductByShop,
    searchProductByUser
}