// Module imports
import {
	useCallback,
	useState,
} from 'react'
import classnames from 'classnames'





// Local imports
import { ProjectConfiguration } from 'components/Installer/ProjectConfiguration'
import { ProjectSummary } from 'components/Installer/ProjectSummary'
import { useAppContext } from 'contexts/AppContext'





export function ConfigureProjects() {
	const {
		data: { projects },
		states: {
			// areProjectsLoaded,
			isUpdatingProjects,
		},
	} = useAppContext()
	const [currentlyOpenProjectID, setCurrentlyOpenProjectID] = useState(null)

	const closeProjectConfiguration = useCallback(() => {
		setCurrentlyOpenProjectID(null)
	}, [setCurrentlyOpenProjectID])

	const mapProjects = useCallback(projectID => {
		return (
			<ProjectSummary
				key={projectID}
				onOpen={() => openProjectConfiguration(projectID)}
				projectID={projectID} />
		)
	}, [])

	const mapProjectForms = useCallback(projectID => {
		return (
			<ProjectConfiguration
				isOpen={currentlyOpenProjectID === projectID}
				key={projectID}
				onClose={closeProjectConfiguration}
				projectID={projectID} />
		)
	}, [
		closeProjectConfiguration,
		currentlyOpenProjectID,
	])

	const openProjectConfiguration = useCallback(projectID => {
		setCurrentlyOpenProjectID(projectID)
	}, [setCurrentlyOpenProjectID])

	const projectIDs = Object.keys(projects || {})

	// if (!areProjectsLoaded) {
	// 	return (
	// 		<>
	// 			Loading projects...
	// 		</>
	// 	)
	// }

	return (
		<div className={classnames({
			'hero-body': true,
			'is-clipped': Boolean(currentlyOpenProjectID),
			'is-relative': true,
			'is-scrollable': true,
			'pb-4': true,
			})}>
			{projectIDs.length && (
				<ul className="container">
					{projectIDs.map(mapProjects)}
				</ul>
			)}

			{projectIDs.map(mapProjectForms)}
		</div>
	)
}
