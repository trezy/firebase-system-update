// Local imports
import { createEndpoint } from 'helpers/createEndpoint'
import { firestore } from 'helpers/firebase.admin'
import httpStatus from 'helpers/httpStatus'





export const handler = async (request, response) => {
	const errors = []

	;['configurationID', 'projectID'].forEach(key => {
		if (!request.query[key]) {
			errors.push(`Missing required parameter: ${key}`)
		}
	})

	if (errors.length) {
		return response.status(httpStatus.BAD_REQUEST).json({ errors })
	}

	const {
		configurationID,
		projectID,
	} = request.query
	const project = request.body

	const projectDoc = firestore
		.collection('configurations')
		.doc(configurationID)
		.collection('projects')
		.doc(projectID)

	const serviceAccountsCollection = firestore.collection('serviceAccounts')

	// Update project in the database
	try {
		const serviceAccountJSON = JSON.parse(project.serviceAccountJSON)
		const serviceAccountReference = await serviceAccountsCollection.add(serviceAccountJSON)

		const serializedProject = {
			...project,
			serviceAccountID: serviceAccountReference.id,
		}

		delete serializedProject.serviceAccountJSON

		await projectDoc.set(serializedProject)
	} catch (error) {
		console.log(error)
		return response.status(httpStatus.INTERNAL_SERVER_ERROR).json({
			details: 'Failed to save project',
			errors: [error.errorInfo],
		})
	}

	return response
		.status(httpStatus.OK)
		.end()
}





export default createEndpoint({
	allowedMethods: ['post'],
	handler,
})
