import webhandle from 'webhandle'
import express from 'express'
import path from 'path'

import AuthorDreck from './dreck.mjs'
import allowGroup from 'webhandle-users/utils/allow-group.js'

import filog from 'filter-log'
let log = filog('author-integrator:')

import AuthorDataService from './data-service.mjs'

let templatesAdded = false
let templates = {}

export default function integrate(dbName, options) {
	let opt = Object.assign({
		collectionName: 'author',
		templateDir: 'node_modules/@dankolz/authors/views',
		mountPoint: '/admin/author',
		allowedGroups: ['administrators']
	}, options || {})
	let collectionName = opt.collectionName


	// setup collections
	if (!webhandle.dbs[dbName].collections[collectionName]) {
		webhandle.dbs[dbName].collections[collectionName] = webhandle.dbs[dbName].db.collection(collectionName)
	}

	// Setup data service
	let dataService = new AuthorDataService({
		collections: {
			default: webhandle.dbs[dbName].collections[collectionName]
		}
	})
	webhandle.services.author = dataService


	// setup admin gui tools
	let dreck = new AuthorDreck({
		dataService: dataService
	})

	let router = dreck.addToRouter(express.Router())
	
	if(opt.allowedGroups && opt.allowedGroups.length > 0) {
		let securedRouter = allowGroup(
			opt.allowedGroups,
			router
		)
		webhandle.routers.primary.use(opt.mountPoint, securedRouter)
	}
	else {
		// Use this for testing or when no group is needed to access
		webhandle.routers.primary.use(opt.mountPoint, router)
	}

	if(!templatesAdded) {
		templatesAdded = true

		// add templates directory
		if (opt.templateDir) {
			webhandle.addTemplateDir(path.join(webhandle.projectRoot, opt.templateDir), {
				immutable: process.env.NODE_ENV === 'development' ? false : true
			})
		}
		
		function createOptionText(author) {
			if(author) {
				return `<option value="${author.id}">${author.name}</option>`
			}
			return ''

		}

		templates['@dankolz/authors/author-option'] = (data) => {
			return createOptionText(data)
		}

		templates['@dankolz/authors/all-author-options-from-db'] = () => {
		}

		templates['@dankolz/authors/all-author-options-from-db'].write = async (thedata, stream, callback) => {
			let authors = await dataService.fetch({})
			let optionsText = ''
			for(let author of authors) {
				optionsText += createOptionText(author)
			}
			stream.write(optionsText, "UTF-8", () => {
				if (callback) {
					callback()
				}
			})
		}

		webhandle.templateLoaders.push((name, callback) => {
			callback(templates[name])
		})

	}
}

integrate.templates = templates
