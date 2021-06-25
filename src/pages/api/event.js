// Module imports
import crypto from 'crypto'





// Local imports
import {
	firebase,
	firestore,
} from 'helpers/firebase.admin'
import { createEndpoint } from 'helpers/createEndpoint'
import { deployFirestore } from 'helpers/deployFirestore'
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
	if (payload.target === 'production') {
		const {
			deployment: {
				meta: {
					githubCommitSha,
					githubOrg,
					githubRepo,
				},
			},
			projectId: projectID,
		} = payload

		const projectDoc = await firestore
			.collection('projects')
			.doc(projectID)
			.get()
		const project = projectDoc.data()

		const serviceAccountDoc = await firestore
			.collection('serviceAccounts')
			.doc(project.serviceAccountID)
			.get()
		const serviceAccount = serviceAccountDoc.data()

		const deploymentPromises = []

		let localAdminApp = null

		try {
			localAdminApp = firebase.app(projectID)
		} catch (error) {
			localAdminApp = firebase.initializeApp({
				credential: firebase.credential.cert(serviceAccount),
				// databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
			}, projectID)
		}

		if (project.serviceConfigs.firestore.isEnabled) {
			deploymentPromises.push(deployFirestore({
				githubCommitSha,
				githubOrg,
				githubRepo,
				localAdminApp,
				project,
			}))
		}

		await Promise.all(deploymentPromises)
	}
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
