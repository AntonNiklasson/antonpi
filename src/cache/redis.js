import config from "config"
import redis from "redis"
import { promisify } from "util"

const redisClient = redis.createClient({
  host: "redis"
})

const getAsync = promisify(redisClient.get).bind(redisClient)

redisClient.on("error", error => {
  console.error(error)
})

export const cache = {
  set(key, value) {
    if (!value) {
      throw new Error()
    }

    const type = value instanceof Buffer ? "buffer" : typeof value
    let encodedValue

    switch (type) {
      case "object": {
        encodedValue = JSON.stringify(value)
        break
      }
      case "buffer": {
        encodedValue = value.toString("base64")
        break
      }
      default:
        encodedValue = value
    }

    redisClient.set(key, JSON.stringify({ type, encodedValue }), "EX", 60)
  },
  async get(key) {
    const data = await getAsync(key)

    if (!data) return null

    const { type, encodedValue } = JSON.parse(data)

    switch (type) {
      case "object": {
        return JSON.parse(encodedValue)
      }
      case "buffer": {
        return Buffer.from(encodedValue, "base64")
      }
      default:
        return encodedValue
    }
  }
}
