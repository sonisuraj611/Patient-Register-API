const { StatusCodes } = require('http-status-codes');

const errorHandler = (err, req, res, next) => {
    let customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || 'Something went wrong, please try agian later',
    }

    return res.status(customError.statusCode).json({ errMsg: customError.msg })
}

module.exports = errorHandler