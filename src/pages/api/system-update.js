// Local imports
import {
	database,
	securityRules,
} from 'helpers/firebase.admin'
import { createEndpoint } from 'helpers/createEndpoint'
import httpStatus from 'helpers/httpStatus'





export const handler = async (request, response) => {
	const {
		email,
		password,
		username,
	} = request.body

	// database.ref

	response.status(httpStatus.OK).end()

	// const rf = admin.securityRules().createRulesFileFromSource('firestore.rules', source)
	// const rs = await admin.securityRules().createRuleset(rf)
	// await admin.securityRules().releaseFirestoreRuleset(rs)

	// try {
	// 	const { uid } = await auth.createUser({
	// 		disabled: false,
	// 		displayName: username,
	// 		email,
	// 		emailVerified: false,
	// 		password,
	// 	})

	// 	await Promise.all([
	// 		firestore
	// 			.collection('profiles')
	// 			.doc(uid)
	// 			.set({ username }),

	// 		firestore
	// 			.collection('settings')
	// 			.doc(uid)
	// 			.set({ theme: 'system' }),
	// 	])

	// 	response.status(httpStatus.CREATED).end()
	// } catch (error) {
	// 	console.log(error)

	// 	switch (error.errorInfo.code) {
	// 		case 'auth/email-already-exists':
	// 			response.status(httpStatus.FORBIDDEN).json({
	// 				errors: [error.errorInfo.code]
	// 			})
	// 			break

	// 		case 'auth/invalid-password':
	// 			response.status(httpStatus.UNPROCESSABLE_ENTITY).json({
	// 				errors: [error.errorInfo.code]
	// 			})
	// 			break

	// 		default:
	// 			response.status(httpStatus.INTERNAL_SERVER_ERROR).json({
	// 				errors: [error.errorInfo.code],
	// 			})
	// 	}
	// }
}





export default createEndpoint({
	allowedMethods: ['post'],
	handler,
})
