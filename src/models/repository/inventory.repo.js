const { inventory } = require("../inventory.model");
const { castStringToObjectIdMongoose } = require("../../utils");

const insertInventory = async ({
    productId,
    shopId,
    stock,
    location = "Unknow",
}) => {
    return await inventory.create({
        inven_productId: castStringToObjectIdMongoose(productId),
        inven_shopId: castStringToObjectIdMongoose(shopId),
        inven_stock: stock,
        inven_location: location,
    });

}
const reservationInventory = async ({ productId, quantity, cartId }) => {
    const query = {
        inven_productId: castStringToObjectIdMongoose(productId),
        inven_stock: { $gte: quantity },
    };
    const updateSet = {
        $inc: {
            inven_stock: -quantity,
        },
        $push: {
            inven_resevations: {
                quantity,
                cartId,
                createOn: new Date(),
            },
        },
    };
    const options = {
        upset: true,
        new: true,
    };
    return await inventory.updateOne(query, updateSet, options);
};

module.exports = {
    insertInventory,
    reservationInventory,
};
