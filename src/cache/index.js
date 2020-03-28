import * as config from "config"

const driver = config.get("cache.driver")

export const cache =
  driver === "redis" ? require("./redis.js") : require("./memory")
