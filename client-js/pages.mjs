import UploadableImage from 'ei-pic-browser/uploadable-image.js'
import clientIntegrator from "../client-lib/integrator.mjs"
clientIntegrator()

window.CKEDITOR_BASEPATH = '/ckeditor/'

async function appSetup() {
	// custom config
    CKEDITOR.config.customConfig = '/webhandle-page-editor/std-config.js' 
	
	let pics = document.querySelectorAll('.author-fields-form input[type="text"].picture-input-field')
	for(let pic of pics) {
		new UploadableImage(pic)
	}
	// require('webhandle-page-editor/app-client')
}

if(window.CKEDITOR) {
	appSetup()
}
else {
	let ckscript = document.createElement('script');
	ckscript.setAttribute('src','/ckeditor/ckeditor.js');
	ckscript.onload = function() {
		appSetup()
	}
	document.head.appendChild(ckscript)
}
