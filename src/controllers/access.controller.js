'use strict';

const { CreatedResponse, SuccessRespone } = require("../core/success.respone");
const AccessService = require("../services/access.service");

class AccessController {

    signUp = async (req, res, next) => {
        return new CreatedResponse({
            message: "Register Ok!",
            metadata: await AccessService.signUp(req.body)
        }).send(res)
    }

    login = async (req, res, next) => {
        return new SuccessRespone({
            message: "Login success",
            metadata: await AccessService.login(req.body)
        }).send(res)
    }

    logout = async (req, res, next) => {
        return new SuccessRespone({
            message: "Logout success",
            metadata: await AccessService.logout(req.keyStore)
        }).send(res)
    }
}

module.exports = new AccessController();