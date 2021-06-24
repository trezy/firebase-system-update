function vercelFetch(route, options) {
	const parsedOptions = { ...options }
	const defaultOptions = {
		headers: {
			Accept: 'application/json',
		},
	}
	const parsedRoute = new URL(`https://api.vercel.com/${route.replace(/^\//, '')}`)

	if (parsedOptions.accessToken) {
		defaultOptions.headers.Authorization = `Bearer ${parsedOptions.accessToken}`
	}

	if (parsedOptions.queryParams) {
		Object.entries(parsedOptions.queryParams).forEach(([key, value]) => {
			if (value === false) {
				return parsedRoute.searchParams.append(key, 'false')
			}

			if (!value) {
				return false
			}

			return parsedRoute.searchParams.append(key, value)
		})
	}

	delete parsedOptions.accessToken
	delete parsedOptions.queryParams

	// console.log('vercelFetch:', {
	// 	parsedRoute: parsedRoute.toString(),
	// 	options: {
	// 		...defaultOptions,
	// 		...parsedOptions,
	// 		headers: {
	// 			...defaultOptions.headers,
	// 			...parsedOptions.headers,
	// 		},
	// 	},
	// })

	return fetch(parsedRoute.toString(), {
		...defaultOptions,
		...parsedOptions,
		headers: {
			...defaultOptions.headers,
			...parsedOptions.headers,
		},
	})
}

export function getAccessToken(code) {
	return vercelFetch('/v2/oauth/access_token', {
		body: new URLSearchParams({
			client_id: process.env.NEXT_PUBLIC_VERCEL_CLIENT_ID,
			client_secret: process.env.VERCEL_CLIENT_SECRET,
			code,
			redirect_uri: process.env.VERCEL_REDIRECT_URI,
		}),
		method: 'post',
	})
}

export async function getAllProjects(options) {
	const projects = []
	const timestamps = new Set
	let next = null
	let previous = null
	let shouldContinue = true
	let loops = 0

	while (shouldContinue && (loops < 10)) {
		const parsedOptions = { ...options }

		if (next) {
			parsedOptions.until = next
		}

		const projectsResponse = await getProjects(parsedOptions)
		const projectsResponseJSON = await projectsResponse.json()

		next = projectsResponseJSON.pagination.next
		previous = projectsResponseJSON.pagination.prev

		projectsResponseJSON.projects.forEach(project => {
			projects.push(project)
			timestamps.add(project.createdAt)
		})

		if (!next) {
			shouldContinue = false
		}

		loops += 1
	}

	return projects
}

export function getConfiguration(options) {
	const {
		accessToken,
		configurationID,
		teamID,
	} = options

	return vercelFetch(`/v1/integrations/configuration/${configurationID}`, {
		accessToken,
		queryParams: {
			teamId: teamID,
		},
	})
}

export function getProject(options) {
	const {
		accessToken,
		projectID,
		teamID,
	} = options

	return vercelFetch(`/v8/projects/${projectID}`, {
		accessToken,
		queryParams: {
			teamId: teamID,
		},
	})
}

export function getProjects(options) {
	const {
		accessToken,
		teamID,
		until,
	} = options

	return vercelFetch(`/v8/projects`, {
		accessToken,
		queryParams: {
			limit: 100,
			until,
			teamId: teamID,
		},
	})
}
