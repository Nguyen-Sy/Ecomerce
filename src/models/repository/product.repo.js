"use strict";

const { Types } = require("mongoose");
const { product } = require("../product.model");
const {
    getSelectData,
    getUnSelectData,
    castStringToObjectIdMongoose,
} = require("../../utils");

const checkProductServer = async (products) => {
    return await Promise.all(
        products.map(async (product) => {
            const foundProduct = await findProductById(product.productId);
            if (foundProduct) {
                return {
                    price: foundProduct.product_price,
                    quantity: product.quantity,
                    productId: foundProduct._id,
                };
            }
        })
    );
};

const findAllProductForShop = async ({ query, limit, skip }) => {
    return await product
        .find(query)
        .populate("product_shop", "name email -_id")
        .sort({ updateAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();
};

const findAllDraftsForShop = async ({ query, limit, skip }) => {
    return await findAllProductForShop({ query, limit, skip });
};

const findAllPublishedForShop = async ({ query, limit, skip }) => {
    return await findAllProductForShop({ query, limit, skip });
};

const findAllProduct = async ({ limit, sort, page, filter, select }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === "ctime" ? { id: -1 } : { id: 1 };
    const products = await product
        .find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean();

    return products.length > 0 ? products : "Have no product in db";
};

const findProductById = async (productId) => {
    return await product.findOne({
        _id: castStringToObjectIdMongoose(productId),
        isPublished: true,
    });
};

const findOneProduct = async ({ product_id, unSelect }) => {
    return await product.findById(product_id).select(getUnSelectData(unSelect));
};

const publishProductByShop = async ({ product_shop, product_id }) => {
    const foundProduct = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id),
    });

    if (!foundProduct) return null;

    foundProduct.isPublished = true;
    foundProduct.isDraft = false;
    console.log(`foundProduct::`, foundProduct);

    const { modifiedCount } = await foundProduct.updateOne(foundProduct);
    return modifiedCount;
};

const unpublishProductByShop = async ({ product_shop, product_id }) => {
    const foundProduct = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id),
    });

    if (!foundProduct) return null;

    foundProduct.isPublished = false;
    foundProduct.isDraft = true;
    console.log(`foundProduct::`, foundProduct);

    const { modifiedCount } = await foundProduct.updateOne(foundProduct);
    return modifiedCount;
};

const updateProductById = async ({
    productId,
    payload,
    model,
    isNew = true,
}) => {
    return await model.findByIdAndUpdate(productId, payload, {
        new: isNew,
    });
};

const searchProductByUser = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch);
    const results = await product
        .find(
            {
                isDraft: false,
                $text: { $search: regexSearch },
            },
            { score: { $meta: "textScore" } }
        )
        .sort({ score: { $meta: "textScore" } })
        .lean();

    return results;
};
module.exports = {
    checkProductServer,
    findAllDraftsForShop,
    findAllPublishedForShop,
    findAllProduct,
    findProductById,
    findOneProduct,
    publishProductByShop,
    unpublishProductByShop,
    updateProductById,
    searchProductByUser,
};
