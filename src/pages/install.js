// Local imports
import { AppContextProvider } from 'contexts/AppContext'
import { Installer } from 'components/Installer'





export default function InstallPage(props) {
	const {
		code,
		configurationID,
		next,
		teamID,
	} = props

	return (
		<AppContextProvider
			code={code}
			configurationID={configurationID}
			next={next}
			teamID={teamID}>
			<Installer />
		</AppContextProvider>
	)
}

export async function getServerSideProps(context) {
	const [
		{ parseQueryParams },
	] = await Promise.all([
		import('helpers/parseQueryParams'),
	])

	const {
		req: request,
	} = context

	const {
		code,
		configurationId: configurationID,
		next,
		teamId: teamID,
	} = parseQueryParams(request.url)

	const props = {
		code,
		configurationID,
		next,
	}

	if (teamID) {
		props.teamID = teamID
	}

	return { props }
}
