const config = require("config")
const redis = require("redis")

const redisClient = redis.createClient(
  `redis://redis:${config.get("redis.port")}`
)

redisClient.on("error", error => {
  console.error(error)
})

module.exports = {
  set(key, value, ttl = config.get("redis.ttl")) {
    if (!value) {
      throw new Error()
    }

    let serializedValue = JSON.stringify(value)

    redisClient.set(key, serializedValue, "EX", ttl)
  },
  get(key) {
    const serializedValue = redisClient.get(key)

    console.log({ serializedValue })

    return JSON.parse(serializedValue)
  }
}
