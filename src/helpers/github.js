function githubFetch(route, options) {
	const parsedOptions = { ...options }
	const defaultOptions = {
		headers: {
			Accept: 'application/vnd.github.v3+json',
		},
	}
	const parsedRoute = new URL(`https://api.github.com/${route.replace(/^\//, '')}`)

	if (parsedOptions.accessToken) {
		defaultOptions.headers.Authorization = `Bearer ${parsedOptions.accessToken}`
	}

	if (parsedOptions.queryParams) {
		Object.entries(parsedOptions.queryParams).forEach(([key, value]) => {
			parsedRoute.searchParams.append(key, value)
		})
	}

	delete parsedOptions.accessToken
	delete parsedOptions.queryParams

	return fetch(parsedRoute.toString(), {
		...defaultOptions,
		...parsedOptions,
		headers: {
			...defaultOptions.headers,
			...parsedOptions.headers,
		},
	})
}

export function getRepoContentsAtPath(org, repo, path = '') {
	return githubFetch(`/repos/${org}/${repo}/contents/${path}`)
}
