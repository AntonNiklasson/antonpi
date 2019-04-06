const axios = require('axios')
const dropboxSdk = require('dropbox').Dropbox
const fetch = require('isomorphic-fetch')

const { DROPBOX_TOKEN } = process.env

const dbx = new dropboxSdk({ accessToken: DROPBOX_TOKEN, fetch })

async function getThumbnails() {
	try {
		const response  = await dbx.filesGetThumbnail(
			{
				path: `/media/photos/2019/20190321 alpe d'huez/dscf3818.jpg`
			}
		)
		
		return response.fileBinary
	} catch(error) {
		return error
	}
}

async function getFolders() {
	try {
		const response  = await dbx.filesListFolder({
			path: `/media/photos/2019/20190321 alpe d'huez`
		})
		return response
	} catch(error) {
		return error
	}
}

module.exports = {
	getThumbnails,
	getFolders,
}
