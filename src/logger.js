const winston = require("winston")
const expressWinston = require("express-winston")

module.exports = {
  requests: expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.simple(),
    meta: false, // optional: control whether you want to log the meta data about the request (default to true)
    msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    colorize: true
  })
}
