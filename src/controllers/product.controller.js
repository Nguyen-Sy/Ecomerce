'use strict'

const ProductService = require("../services/product.service")
const { CreatedResponse, SuccessRespone } = require('../core/success.respone')

class ProductController {

    createProduct = async (req, res, next) => {
        return new CreatedResponse({
            message: 'Create product success',
            metadata: await ProductService.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    getAllDraftsForShop = async (req, res, next) => {
        return new SuccessRespone({
            message: 'Get list draft success',
            metadata: await ProductService.findAllDraftsForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }

    getAllPublishedForShop = async (req, res, next) => {
        return new SuccessRespone({
            message: 'Get list published success',
            metadata: await ProductService.findAllPublishedForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }

    getListSearchProduct = async (req, res, rext) => {
        return new SuccessRespone({
            message: 'Get list search success',
            metadata: await ProductService.searchProduct(req.params)
        }).send(res)
    }

    findAllProducts = async (req, res, next) => {
        return new SuccessRespone({
            message: 'Find all products',
            metadata: await ProductService.findAllProducts(req.query)
        })
    }

    findOneProduct = async (req, res, next) => {
        return new SuccessRespone({
            message: 'Find all products',
            metadata: await ProductService.findOneProduct(req.params.product_id)
        })
    }

    publishProductByShop = async (req, res, next) => {
        return new SuccessRespone({
            message: 'Publish product success',
            metadata: await ProductService.publishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params['id']
            })
        }).send(res)
    }

    unpublishProductByShop = async (req, res, next) => {
        return new SuccessRespone({
            message: 'Unpublish product success',
            metadata: await ProductService.unpublishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params['id']
            })
        }).send(res)
    }
}

module.exports = new ProductController()