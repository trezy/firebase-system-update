// Local imports
import { createEndpoint } from 'helpers/createEndpoint'
import httpStatus from 'helpers/httpStatus'





export const handler = async (request, response) => {
	return response.status(httpStatus.OK).end()
}





export default createEndpoint({
	allowedMethods: ['get'],
	handler,
})
