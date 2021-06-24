// Module imports
import crypto from 'crypto'





// Local imports
import { createEndpoint } from 'helpers/createEndpoint'
import {
	firestore,
	securityRules,
} from 'helpers/firebase.admin'
import httpStatus from 'helpers/httpStatus'





async function handleConfigurationRemoved(payload) {
	const batch = firestore.batch()
	const configurationReference = firestore
		.collection('configurations')
		.doc(payload.configuration.id)
	const serviceAccountsCollection = firestore.collection('serviceAccounts')

	const projectsReference = firestore.collection('projects').where('configurationID', '==', payload.configuration.id)
	const projectsSnapshot = await projectsReference.get()

	// Batch delete projects
	projectsSnapshot.forEach(doc => {
		batch.delete(doc.ref)

		const { serviceAccountID } = doc.data()

		if (serviceAccountID) {
			batch.delete(serviceAccountsCollection.doc(serviceAccountID))
		}
	})
	await batch.commit()

	// Delete the configuration
	await configurationReference.delete()
}

async function handleDeploymentReady(payload) {
	console.log('handleDeploymentReady', JSON.stringify(payload, null, 2))

	if (payload.target === 'production') {
		const {
			githubCommitSha,
			githubOrg,
			githubRepo,
		} = payload.deployment.meta

		const filePath = 'firebase/database.rules.json'
		const rawFileDownloadPath = `https://raw.githubusercontent.com/${githubOrg}/${githubRepo}/${githubCommitSha}/${filePath}`
	}

	// securityRules
	// return firestore
	// 	.collection('configurations')
	// 	.doc(configurationID)
	// 	.delete()
}

export const handler = async (request, response) => {
	if (!request.headers['x-vercel-signature']) {
		return response.status(httpStatus.OK).end()
	}

	const signature = crypto.createHmac('sha1', process.env.VERCEL_CLIENT_SECRET)
    .update(JSON.stringify(request.body))
    .digest('hex')

	if (request.headers['x-vercel-signature'] !== signature) {
		return response.status(httpStatus.UNAUTHORIZED).end()
	}

	const {
		payload,
		type,
	} = request.body

	switch (type) {
		case 'deployment-ready':
			await handleDeploymentReady(payload)
			break

		case 'integration-configuration-removed':
			await handleConfigurationRemoved(payload)
			break

		default:
			return response.status(httpStatus.NOT_IMPLEMENTED).end()
	}

	return response.status(httpStatus.OK).end()
}





export default createEndpoint({
	allowedMethods: [
		'delete',
		'post',
	],
	handler,
})
