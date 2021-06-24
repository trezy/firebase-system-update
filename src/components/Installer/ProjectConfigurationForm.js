// Module imports
import PropTypes from 'prop-types'





// Local imports
import { SelectServicesFields } from 'components/Installer/SelectServicesFields'
import { SetupFirestoreFields } from 'components/Installer/SetupFirestoreFields'
import { SetupRealtimeDatabaseFields } from 'components/Installer/SetupRealtimeDatabaseFields'
import { SetupRemoteConfigFields } from 'components/Installer/SetupRemoteConfigFields'
import { SetupServiceAccountFields } from 'components/Installer/SetupServiceAccountFields'
import { SetupStorageFields } from 'components/Installer/SetupStorageFields'
import { useAppContext } from 'contexts/AppContext'





function ProjectConfigurationForm(props) {
	const { projectID } = props
	const {
		data: { projects },
	} = useAppContext()

	const project = projects[projectID]

	return (
		<div className="column is-scrollable is-full">
			{(project.currentStep === 'selectServices') && (
				<SelectServicesFields />
			)}

			{(project.currentStep === 'setup::firestore') && (
				<SetupFirestoreFields projectID={projectID} />
			)}

			{(project.currentStep === 'setup::realtimeDatabase') && (
				<SetupRealtimeDatabaseFields projectID={projectID} />
			)}

			{(project.currentStep === 'setup::remoteConfig') && (
				<SetupRemoteConfigFields projectID={projectID} />
			)}

			{(project.currentStep === 'setup::storage') && (
				<SetupStorageFields projectID={projectID} />
			)}

			{(project.currentStep === 'setupServiceAccount') && (
				<SetupServiceAccountFields projectID={projectID} />
			)}
		</div>
	)
}

ProjectConfigurationForm.propTypes = {
	projectID: PropTypes.string.isRequired,
}





export { ProjectConfigurationForm }
