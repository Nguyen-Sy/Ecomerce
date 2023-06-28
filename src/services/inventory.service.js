"use strict";

const { BadRequestError } = require("../core/error.respone");
const { inventory } = require("../models/inventory.model");
const { findProductById } = require("../models/repository/product.repo");

class InventoryService {
    static async addStockToInventory({
        stock,
        productId,
        shopId,
        location = "Unknown",
    }) {
        const product = await findProductById(productId);
        if (!product) throw new BadRequestError("Product is not existed");

        const query = {
            inven_productId: productId,
            inven_shopId: shopId,
        };
        const updateSet = {
            $inc: {
                inven_stock: stock,
            },
            $set: {
                inven_location: location,
            },
        };
        const options = {
            new: true,
            upsert: true,
        };

        return await inventory.findOneAndUpdate(query, updateSet, options);
    }
}

module.exports = InventoryService;
