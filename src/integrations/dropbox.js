import { Dropbox } from "dropbox"
import fetch from "isomorphic-fetch"
import config from "config"
import _ from "lodash/fp"
import { cache } from "../cache"
function transformFile(file) {
  return _.pipe(
    _.pick(["id", "rev", "path_lower", "name", "size"]),
    _.set("url", `${config.get("domain")}/photos/${file.id}/thumbnail`),
    _.set("size", { width: 960, height: 640 })
  )(file)
}

const dbx = new Dropbox({
  accessToken: config.get("dropbox.token"),
  fetch
})

export async function getFile(id) {
  const key = `dropbox.${id}`
  let file = await cache.get(key)

  if (!file) {
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
      file = response.fileBinary

      cache.set(key, file)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  return file
}

export async function getAllFiles() {
  let key = "dropbox.files"
  let files = await cache.get(key)

  if (!files) {
    try {
      const response = await dbx.filesListFolder({
        path: ``
      })

      files = response.entries.map(transformFile)

      cache.set(key, files)
    } catch (error) {
      console.log("[Dropbox]", error)
      return error
    }
  }

  return files
}
