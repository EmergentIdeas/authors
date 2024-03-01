
import path from "path"
import express from "express"
import filog from "filter-log"
import loadTemplates from "./add-templates.js"
import webhandle from "webhandle"
import enableAuthor from './setups/enable-author.mjs'
import enablePageEditor from './setups/enable-page-editor.mjs'
import AuthorTestDreck from "./author-test-dreck.mjs"

let log

export default function(app) {
	let firstDb = Object.keys(webhandle.dbs)[0]
	let dbName = firstDb || "unknowndb"
	log = filog(dbName)

	// add a couple javascript based tripartite templates. More a placeholder
	// for project specific templates than it is a useful library.
	loadTemplates()
	
	webhandle.addTemplateDir('test-views')
	
	webhandle.routers.preStatic.get(/.*\.cjs$/, (req, res, next) => {
		console.log('cjs')
		res.set('Content-Type', "application/javascript")
		next()
	})
	enableAuthor(dbName, {
		templateDir: null
		, allowedGroups: []
	})
	
	
	let authorTestDreck = new AuthorTestDreck({
		dataService: webhandle.services.author
	})
	let router = express.Router()
	authorTestDreck.addToRouter(router)
	app.use('/author-test', router)
	
	app.get('/author-replacement-test', async (req, res, next) => {
		let ds = webhandle.services.author
		let authors = await ds.fetch({})
		let author = authors[0]
		let show = [
			{
				author: author.id
			}
			, {
				author: author._id
			}
		]
		res.locals.showAuthors = await ds.replaceAuthorFromId(show)
		next()
	})
	
	enablePageEditor()

}

