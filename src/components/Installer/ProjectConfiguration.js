// Module imports
import {
	useCallback,
	useState,
} from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'





// Local imports
import { FontAwesomeIcon } from 'components/FontAwesomeIcon'
import { Form } from 'components/Form'
import { ProjectConfigurationFooter } from 'components/Installer/ProjectConfigurationFooter'
import { ProjectConfigurationForm } from 'components/Installer/ProjectConfigurationForm'
import { ProjectConfigurationSidebar } from 'components/Installer/ProjectConfigurationSidebar'
import { useAppContext } from 'contexts/AppContext'





function ProjectConfiguration(props) {
	const {
		projectID,
		isOpen,
		onClose,
	} = props
	const {
		data: { projects },
		finishProjectConfiguration,
		saveProject,
		updateProjectServiceConfig,
		updateProjectServices,
	} = useAppContext()
	const [initialFormState, setInitialFormState] = useState({
		firestoreIsEnabled: false,
		realtimeDatabaseIsEnabled: false,
		remoteConfigIsEnabled: false,
		serviceAccountJSON: '',
		storageIsEnabled: false,
	})

	const project = projects[projectID]

	const handleSubmit = useCallback(async formState => {
		const {
			isValid,
			values,
		} = formState

		const currentStepIndex = project.steps.findIndex(({ id }) => id === project.currentStep)
		const currentStepIsLastStep = currentStepIndex === (project.steps.length - 1)

		if (project.currentStep === 'selectServices') {
			setInitialFormState(previousState => {
				const newState = { ...previousState }

				if (!values.firestoreIsEnabled) {
					newState['firestore::rulesPath'] = ''
					newState['firestore::indexesPath'] = ''
				}

				if (!values.realtimeDatabaseIsEnabled) {
					newState['realtimeDatabase::rulesPath'] = ''
				}

				if (!values.remoteConfigIsEnabled) {
					newState['remoteConfig::templatePath'] = ''
				}

				if (!values.storageIsEnabled) {
					newState['storage::rulesPath'] = ''
				}

				return newState
			})

			updateProjectServices(projectID, {
				firestore: values.firestoreIsEnabled,
				realtimeDatabase: values.realtimeDatabaseIsEnabled,
				remoteConfig: values.remoteConfigIsEnabled,
				storage: values.storageIsEnabled,
			})
		}

		if (project.currentStep.startsWith('setup::')) {
			const service = project.currentStep.replace(/^setup::/, '')
			const serviceConfig = project.serviceConfigs[service]

			updateProjectServiceConfig(projectID, service, {
				...serviceConfig,
				...Object.entries(values).reduce((accumulator, [key, value]) => {
					if (key.startsWith(`${service}::`)) {
						accumulator[key.replace(new RegExp(`${service}::`), '')] = value
					}

					return accumulator
				}, {}),
			})
		}

		if (currentStepIsLastStep && isValid) {
			finishProjectConfiguration(projectID, values.serviceAccountJSON)
			await saveProject(projectID, values.serviceAccountJSON)
			onClose()
		}
	}, [
		project,
		projectID,
		updateProjectServiceConfig,
		updateProjectServices,
	])

	return (
		<div
			className={classnames({
				'is-open': isOpen,
				'is-slidable': true,
				'panel': true,
			})}>
			<header className="panel-heading">
				<button
					className="panel-heading-left"
					onClick={onClose}>
					<FontAwesomeIcon
						fixedWidth
						icon="chevron-left" />
				</button>

				<h2>{`Configuring ${project.name}`}</h2>
			</header>

			<Form
				className="is-clipped is-flex is-flex-direction-column panel-body"
				initialValues={initialFormState}
				onSubmit={handleSubmit}>
				<div className="columns is-clipped is-flex-grow-1 is-mobile m-0">
					{/* <ProjectConfigurationSidebar projectID={projectID} /> */}
					<ProjectConfigurationForm projectID={projectID} />
				</div>

				<ProjectConfigurationFooter projectID={projectID} />
			</Form>
		</div>
	)
}

ProjectConfiguration.defaultProps = {
	onClose: () => {},
}

ProjectConfiguration.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func,
	projectID: PropTypes.string.isRequired,
}





export { ProjectConfiguration }
