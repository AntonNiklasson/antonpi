const axios = require("axios")
const dropboxSdk = require("dropbox").Dropbox
const fetch = require("isomorphic-fetch")

const { DROPBOX_TOKEN } = process.env

const dbx = new dropboxSdk({
  accessToken: DROPBOX_TOKEN,
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

    console.log(response)

    return response.fileBinary
  } catch (error) {
    console.error(error)
    return error
  }
}

async function getAllFiles() {
  try {
    const response = await dbx.filesListFolder({
      path: `/media/photos/featured`
    })

    return response.entries
  } catch (error) {
    return error
  }
}

module.exports = {
  getFile,
  getAllFiles
}
