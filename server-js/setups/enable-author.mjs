let initialized = false
import serverIntegrator from "../../server-lib/integrator.mjs"
export default function enableAuthor(dbName, options) {
	if (!initialized) {
		initialized = true
		serverIntegrator(dbName, options)
	}
}

