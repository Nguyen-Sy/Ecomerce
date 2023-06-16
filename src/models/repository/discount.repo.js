const discount = require("../discount.model");
const { getSelectData, getUnSelectData } = require("../../utils");

const findDiscountByCodeAndShopId = async ({ shopId, code }) => {
    const foundDiscount = await discount
        .findOne({ discount_shopId: shopId, discount_code: code })
        .lean();
    return foundDiscount;
};

const findAllDiscountSelect = async ({
    limit = 50,
    page = 1,
    select,
    filter,
    sort = "ctime",
}) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === "ctime" ? { id: -1 } : { id: 1 };
    const discounts = await discount
        .find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean();

    return discounts.length > 0 ? discounts : null;
};
const findAllDiscountUnSelect = async ({
    limit = 50,
    page = 1,
    unselect,
    filter,
    sort = "ctime",
}) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === "ctime" ? { id: -1 } : { id: 1 };
    const discounts = await discount
        .find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getUnSelectData(unselect))
        .lean();

    return discounts.length > 0 ? discounts : null;
};

module.exports = {
    findAllDiscountSelect,
    findAllDiscountUnSelect,
    findDiscountByCodeAndShopId,
};
