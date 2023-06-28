const { order } = require("../order.model");

const getAllOrderByUserId = async (userId) => {
    return await order.find({
        order_userId: userId,
    });
};

const getOneOrder = async (orderId) => {
    return await order.findById(orderId);
};

module.exports = {
    getAllOrderByUserId,
    getOneOrder,
};
