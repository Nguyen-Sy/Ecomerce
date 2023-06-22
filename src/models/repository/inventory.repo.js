const { inventory } = require("../inventory.model");
const { castStringToObjectIdMongoose } = require("../../utils");
const insertInventory = async ({
    productId,
    shopId,
    stock,
    location = "Unknow",
}) =>
    await inventory.create({
        inven_productId: castStringToObjectIdMongoose(productId),
        inven_shopId: castStringToObjectIdMongoose(shopId),
        inven_stock: stock,
        inven_location: location,
    });

module.exports = {
    insertInventory,
};
