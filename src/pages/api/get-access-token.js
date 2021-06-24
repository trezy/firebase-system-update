// Local imports
import { createEndpoint } from 'helpers/createEndpoint'
import { firestore } from 'helpers/firebase.admin'
import * as vercel from 'helpers/vercel'
import httpStatus from 'helpers/httpStatus'





export const handler = async (request, response) => {
	const errors = []
	let accessToken = null
	let projects = null

	;['code', 'configurationID'].forEach(key => {
		if (!request.body[key]) {
			errors.push(`Missing required parameter: ${key}`)
		}
	})

	if (errors.length) {
		return response.status(httpStatus.BAD_REQUEST).json({ errors })
	}

	const {
		code,
		configurationID,
		teamID,
	} = request.body

	// Get access token from Vercel
	try {
		const accessTokenResponse = await vercel.getAccessToken(code)
		const accessTokenResponseJSON = await accessTokenResponse.json()

		accessToken = accessTokenResponseJSON.access_token
	} catch (error) {
		return response.status(httpStatus.INTERNAL_SERVER_ERROR).json({
			errors: [error],
		})
	}

	// Get configuration from Vercel
	try {
		const configurationResponse = await vercel.getConfiguration({
			accessToken,
			configurationID,
		})
		const configurationResponseJSON = await configurationResponse.json()
		projects = configurationResponseJSON.configuration.projects
	} catch (error) {
		return response.status(httpStatus.INTERNAL_SERVER_ERROR).json({
			errors: [error],
		})
	}

	const configurationDoc = firestore.collection('configurations').doc(configurationID)

	try {
		const configurationData = { accessToken }

		if (teamID) {
			configurationData.teamID = teamID
		}

		await configurationDoc.set(configurationData)
		await Promise.all(projects.map(projectID => {
			return configurationDoc
				.collection('projects')
				.doc(projectID)
				.set({})
		}))
	} catch (error) {
		return response.status(httpStatus.INTERNAL_SERVER_ERROR).json({
			errors: [error.errorInfo],
		})
	}

	return response.status(httpStatus.OK).json({
		accessToken,
	})
}





export default createEndpoint({
	allowedMethods: ['post'],
	handler,
})
