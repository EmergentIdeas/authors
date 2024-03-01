import Dreck from 'dreck'
import addCallbackToPromise from 'add-callback-to-promise'

import simplePropertyInjector from 'dreck/binders/simple-property-injector.js'


export default class AuthorTestDreck extends Dreck {

	constructor(options) {
		super(options)
		let curDreck = this
		Object.assign(this, 
			{
				templatePrefix: 'test-author/',
				locals: {
					pretemplate: 'app_pre',
					posttemplate: 'app_post'
				},
				injectors: [
					(req, focus, next) => {
						simplePropertyInjector(req, focus, curDreck.bannedInjectMembers, next)
					}
				]
			}
		)
	}
	
	async addAdditionalFormInformation(focus, req, res, callback) {
		let authors = await this.dataService.fetch({})
		res.locals.authors = authors

		return super.addAdditionalFormInformation(focus, req, res, callback)
	}
}