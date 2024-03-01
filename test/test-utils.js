import mocha from "mocha";
import {assert} from 'chai'
import camelCaseFromDashed from "../bin/camel-case.mjs"
import grepMatchingFiles from "../bin/grep-matching-files.mjs"
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
import path from 'path'
const packageDir = path.resolve(__dirname, '..')

describe("test utils", function() {
	
	it("camelCase", function() {

		assert.equal(camelCaseFromDashed('hello-there-world'), 'helloThereWorld')
		assert.equal(camelCaseFromDashed('hello there world'), 'helloThereWorld')
		assert.equal(camelCaseFromDashed('hello'), 'hello')
	})
	it("grep", function() { 
		let out = grepMatchingFiles(packageDir, 'less', 'data-type-name')	
		assert.equal(out.length, 1)
		assert.isTrue(out[0].endsWith('components.less'))
	})

})