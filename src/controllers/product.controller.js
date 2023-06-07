'use strict'

const ProductService = require("../services/product.service")
const { CreatedResponse } = require('../core/success.respone')

class ProductController {

    createProduct = async (req, res, next) => {
        return new CreatedResponse({
            message: 'Create product success',
            metadata: await ProductService.createProduct(req.body.product_type, {
                ...req.body,
                product_shop : req.user.userId
            })
        }).send(res)
    }

}

module.exports = new ProductController()