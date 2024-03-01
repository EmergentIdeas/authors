
import MongoDataService from '@dankolz/mongodb-data-service'

export default class AuthorDataService extends MongoDataService {

	/**
	 * Transforms the results of fetches. This is sometimes done when the object from the database should be augmented
	 * with additional information or should be converted into an object with a specific class. Override this function
	 * at need. By default it does essentially nothing.
	 * @param {object[]} result An array of objects from the database
	 * @param {string} collectionName The name of the collection these objects came from. If this class only queries a single
	 * collection, this parameter won't be of much use. If it queries multiple collection, this will help inform the method
	 * what to do with the object.
	 * @returns A promise which results in an array of objects.
	 */
	// async postFetchesProcessor(result, collectionName) {
	// 	return new Promise((resolve, reject) => {
	// 		result = result.map(item => new Hierarchy(item))
	// 		resolve(result)
	// 	})
	// }

	/**
	 * Gets all authors grouped by id and _id and either
	 */
	async authorsByIds() {
		let authorsById = {}
		let authorsBy_Id = {}
		let authorsByAnyId = {}

		let authors = await this.fetch({})
		for(let author of authors) {
			authorsById[author.id] = author
			authorsBy_Id[author._id] = author
			authorsByAnyId[author.id] = author
			authorsByAnyId[author._id] = author
		}

		return { authorsById, authorsBy_Id, authorsByAnyId}
	}	

	/**
	 * 
	 * Looks for member of the objects which match the id or _id of authors
	 * and replaces those ids with the author object.
	 * @param {object|array} focus The focus of the replacements, either an array or a single object
	 * @param {object} options
	 * @param {string} options.memberName The key of the object which is examined. "author" by default
	 * @returns The same object passed in as focus
	 */
	async replaceAuthorFromId(focus, {memberName = 'author'} = {}) {
		let {authorsById, authorsBy_Id} = await this.authorsByIds()
		
		let focusArray
		if(Array.isArray(focus)) {
			focusArray = focus
		}
		else {
			focusArray = [focus]
		}
		
		for(let ref of focusArray) {
			let id = ref[memberName]
			if(id) {
				ref[memberName] = authorsBy_Id[id] || authorsById[id] 
			}
		}

		return focus
	}
}

