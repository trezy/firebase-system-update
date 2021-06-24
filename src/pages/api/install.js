// Local imports
import { createEndpoint } from 'helpers/createEndpoint'
import { firestore } from 'helpers/firebase.admin'
import * as vercel from 'helpers/vercel'
import httpStatus from 'helpers/httpStatus'





export const handler = async (request, response) => {
	const errors = []
	const responseJSON = {
		accessToken: null,
		projects: {},
	}
	let accessToken = null
	let projectSelection = null
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
		responseJSON.accessToken = accessToken
	} catch (error) {
		return response.status(httpStatus.INTERNAL_SERVER_ERROR).json({
			details: 'Failed to retrieve access token from Vercel',
			errors: [error],
		})
	}

	// Get configuration from Vercel
	try {
		const configurationResponse = await vercel.getConfiguration({
			accessToken,
			configurationID,
			teamID,
		})
		const configurationResponseJSON = await configurationResponse.json()
		projects = configurationResponseJSON.projects
		projectSelection = configurationResponseJSON.projectSelection
	} catch (error) {
		return response.status(httpStatus.INTERNAL_SERVER_ERROR).json({
			details: 'Failed to retrieve configuration from Vercel',
			errors: [error],
		})
	}

	const configurationDoc = firestore
		.collection('configurations')
		.doc(configurationID)

	// Store app information in the database
	try {
		const configurationData = { accessToken }

		if (teamID) {
			configurationData.teamID = teamID
		}

		await configurationDoc.set(configurationData)
	} catch (error) {
		return response.status(httpStatus.INTERNAL_SERVER_ERROR).json({
			details: 'Failed to save configuration',
			errors: [error.errorInfo],
		})
	}

	// Store projects in the database
	try {
		let projectsData = null

		if (projectSelection === 'all') {
			projectsData = await vercel.getAllProjects({
				accessToken,
				teamID,
			})
		} else {
			projectsData = await Promise.all(projects.map(async projectID => {
				const projectResponse = await vercel.getProject({
					accessToken,
					projectID,
					teamID,
				})
				return projectResponse.json()
			}))
		}

		responseJSON.projects = projectsData.reduce((accumulator, project) => {
			accumulator[project.id] = {
				configurationID,
				id: project.id,
				link: {
					org: project.link.org,
					repo: project.link.repo,
					type: project.link.type,
				},
				name: project.name,
				serviceConfigs: {
					firestore: { isEnabled: false },
					realtimeDatabase: { isEnabled: false },
					remoteConfig: { isEnabled: false },
					storage: { isEnabled: false },
				},
				targets: Object.keys(project.targets),
			}
			return accumulator
		}, {})

		await Promise.all(
			Object.values(responseJSON.projects)
				.map(project => firestore
					.collection('projects')
					.doc(project.id)
					.set(project))
		)
	} catch (error) {
		console.log(error)
		return response.status(httpStatus.INTERNAL_SERVER_ERROR).json({
			details: 'Failed to save projects',
			errors: [error.errorInfo],
		})
	}

	return response
		.status(httpStatus.OK)
		.json(responseJSON)
}





export default createEndpoint({
	allowedMethods: ['post'],
	handler,
})
