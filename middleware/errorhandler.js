const {Constant} = require("../Constant")
const errorhandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;

    switch (statusCode) {
        case Constant.VALIDATION_ERROR:
            res.json({
                title: "validation Failed",
                message: err.message,
                stackTrace: err.stack
            });
            break;
        case Constant.NOT_FOUND:
            res.json({
                title: "not found",
                message: err.message,
                stackTrace: err.stack
            })
            break;
        case Constant.FORBIDDEN:
            res.json({
                title: "Forbidden",
                message: err.message,
                stackTrace: err.stack
            })
            break;
        case Constant.UNAUTHORIZED:
            res.json({
                title: "unauthorized",
                message: err.message,
                stackTrace: err.stack
            })
            break;
        case Constant.SERVER_ERROR:
            res.json({
                title: "server error",
                message: err.message,
                stackTrace: err.stack
            })
            break;
        default:
            console.log("NO ERROR ALL GOOD")
            break;
    }



}

module.exports = errorhandler;