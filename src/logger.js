import * as winston from "winston"
import * as expressWinston from "express-winston"

export const requestLogger = expressWinston.logger({
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple()
  ),
  meta: false,
  colorize: false
})
