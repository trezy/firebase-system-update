export function parseQueryParams(queryStringOrURL) {
	const queryStringStartsAt = queryStringOrURL.indexOf('?')

	let queryString = queryStringOrURL

	if (queryStringStartsAt !== -1) {
		queryString = queryStringOrURL.substring(queryStringStartsAt + 1)
	}

	return queryString.split('&').reduce((accumulator, pair) => {
		const [key, value] = pair.split('=')

		if (accumulator[key]) {
			if (Array.isArray(accumulator[key])) {
				accumulator[key].push(value)
			} else {
				accumulator[key] = [accumulator[key], value]
			}
		} else {
			accumulator[key] = value
		}

		return accumulator
	}, {})
}
