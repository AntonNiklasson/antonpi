const axios = require("axios")
const dropboxSdk = require("dropbox").Dropbox
const fetch = require("isomorphic-fetch")
const config = require("config")
const redis = require("../redis")

const dbx = new dropboxSdk({
  accessToken: config.get("dropbox.token"),
  fetch
})

async function getFile(id) {
  const files = await getAllFiles()
  const requestedFile = files.find(f => f.id === id)

  if (!requestedFile) {
    return null
  }

  try {
    const response = await dbx.filesGetThumbnail({
      path: requestedFile.path_lower,
      size: {
        ".tag": "w960h640"
      }
    })

    return response.fileBinary
  } catch (error) {
    console.error(error)
    return error
  }
}

async function getAllFiles() {
  const cacheKey = "dropbox.allfiles"
  let response = redis.get(cacheKey)
  let source = "cache"

  if (!response) {
    try {
      const response = await dbx.filesListFolder({
        path: `/media/photos/featured`
      })
      source = "api"
      redis.set(cacheKey, response)
    } catch (error) {
      return error
    }
  }

  return { source, data: response.entries }
}

module.exports = {
  getFile,
  getAllFiles
}
