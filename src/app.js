require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const { default: helmet } = require('helmet')
const compression = require('compression')
const app = express()

//init middleware
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

// init db 
require("./dbs/init.mongodb")
// const { checkOverLoading } = require("./helpers/check.connect")
// checkOverLoading()

// init routes
app.use("/", require("./routes"))

// handle error
app.use((req, res, next) => {
    const error = new Error("Not found")
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: error.message || 'Interal Server error'
    })
}
)
module.exports = app