// const secureRouter = require('../utils/secure-router')

import webhandle from 'webhandle'
import path from 'path'
import express from 'express'
import editorIntegrator from 'webhandle-page-editor/webhandle-integrator.js'

let setup
export default setup = async() => {
	
	let pageEditingRouter = express.Router()
	await editorIntegrator(webhandle, path.join(webhandle.projectRoot, 'pages'), pageEditingRouter)
	// let securedRouter = secureRouter(pageEditingRouter, {groups: ['administrators', 'page-editors']})
	// webhandle.routers.primary.use('/webhandle-page-editor', securedRouter)
	webhandle.routers.primary.use('/webhandle-page-editor', pageEditingRouter)
}
