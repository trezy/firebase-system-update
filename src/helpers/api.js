// Module imports
import LocalForage from 'localforage'





async function apiFetch(route, options) {
	const parsedOptions = { ...options }
	const defaultOptions = {
		headers: {
			Accept: 'application/json',
		},
	}

	const accessToken = await LocalForage.getItem('vercelAccessToken')

	if (accessToken) {
		defaultOptions.headers.Authorization = `Bearer ${accessToken}`
	}

	if (parsedOptions.requireAuthentication && !accessToken) {
		throw new Error('No access token is available.')
	}

	delete parsedOptions.requireAuthentication

	if (!['string', 'undefined'].includes(typeof parsedOptions.body)) {
		parsedOptions.body = JSON.stringify(parsedOptions.body)
		parsedOptions.headers = {
			...parsedOptions.headers,
			'Content-Type': 'application/json',
		}
	}

	return fetch(`/api/${route.replace(/^\//, '')}`, {
		...defaultOptions,
		...parsedOptions,
		headers: {
			...defaultOptions.headers,
			...parsedOptions.headers,
		},
	})
}

export function getConfiguration(options) {
	const { configurationID } = options

	return apiFetch(`/configuration/${configurationID}`)
}

export function install(options) {
	return apiFetch('/install', {
		body: options,
		method: 'post',
	})
}

export function saveProject(options) {
	const {
		projectID,
		project,
	} = options
	return apiFetch(`/project/${projectID}`, {
		body: project,
		method: 'post',
	})
}
