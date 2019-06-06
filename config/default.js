module.exports = {
  host: "localhost",
  port: 5001,
  domain: "http://localhost",

  cache: {
    driver: "memory",
    ttl: 60
  },

  dropbox: {
    token: process.env.DROPBOX_TOKEN
  }
}
