// Local imports
import { createEndpoint } from 'helpers/createEndpoint'
import { firestore } from 'helpers/firebase.admin'
import * as vercel from 'helpers/vercel'
import httpStatus from 'helpers/httpStatus'





export const handler = async (request, response) => {
	const { configurationID } = request.query
	const errors = []

	const appDoc = await firestore
		.collection('configurations')
		.doc(configurationID)
		.get()

	const { accessToken } = appDoc.data()

	if (accessToken !== request.headers.authorization.replace(/^Bearer /, '')) {
		return response.status(httpStatus.UNAUTHORIZED).end()
	}

	try {
		const response = await vercel.getConfiguration({
			accessToken,
			configurationID,
		})
		const responseJSON = await response.json()

		console.log('Configuration:', JSON.stringify(responseJSON, null, 2))
	} catch (error) {
		console.log('ERROR', error)
		return response.status(httpStatus.INTERNAL_SERVER_ERROR).json({
			errors: [error],
		})
	}

	return response.status(httpStatus.OK).end()

	// try {
	// 	const response = await vercel.getConfiguration(code)
	// 	const responseJSON = await response.json()

	// 	accessToken = responseJSON.access_token
	// } catch (error) {
	// 	return response.status(httpStatus.INTERNAL_SERVER_ERROR).json({
	// 		errors: [error],
	// 	})
	// }

	// const configurationDoc = firestore.collection('configurations').doc(configurationID).get()

	// try {
	// 	const configurationData = { accessToken }

	// 	if (teamID) {
	// 		configurationData.teamID = teamID
	// 	}

	// 	await configurationDoc.set(configurationData)
	// } catch (error) {
	// 	return response.status(httpStatus.INTERNAL_SERVER_ERROR).json({
	// 		errors: [error.errorInfo],
	// 	})
	// }

	// return response.status(httpStatus.OK).json({
	// 	accessToken,
	// })
}





export default createEndpoint({
	allowedMethods: ['get'],
	handler,
})
