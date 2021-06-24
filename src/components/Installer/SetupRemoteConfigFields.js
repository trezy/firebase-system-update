// Module imports
import { useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'





// Local imports
import { Field } from 'components/Form/Field'
import { FieldInput } from 'components/Form/FieldInput'
import { FormButton } from 'components/Form/FormButton'
import { GithubExplorer } from 'components/GithubExplorer'
import { useAppContext } from 'contexts/AppContext'
import { useForm } from 'components/Form'





function SetupRemoteConfigFields(props) {
	const { projectID } = props
	const { changeStepCompletion } = useAppContext()
	const {
		updateValue,
		values,
	} = useForm()

	const deselectTemplateFile = useCallback(() => {
		updateValue('remoteConfig::templatePath', '')
	}, [updateValue])

	const selectTemplateFile = useCallback(itemPath => {
		updateValue('remoteConfig::templatePath', itemPath)
	}, [updateValue])

	useEffect(() => {
		const isComplete = Boolean(values['remoteConfig::templatePath'])
		changeStepCompletion(projectID, 'setup::remoteConfig', isComplete)
	}, [
		changeStepCompletion,
		projectID,
		values,
	])

	return (
		<>
			<h3 className="heading">
				{'Configure Remote Config'}
			</h3>

			{!values['remoteConfig::templatePath'] && (
				<GithubExplorer
					onSelect={selectTemplateFile}
					projectID={projectID}
					title="Select your Remote Config template file" />
			)}

			{Boolean(values['remoteConfig::templatePath']) && (
				<Field
					id="remoteConfig::templatePath"
					label="Path to Remote Config template">
					<FieldInput
						className="is-fullwidth"
						id="remoteConfig::templatePath"
						isDisabled
						readOnly />

					<div className="control">
						<FormButton
							className="is-primary"
							onClick={deselectTemplateFile}>
							{'Change'}
						</FormButton>
					</div>
				</Field>
			)}
		</>
	)
}

SetupRemoteConfigFields.propTypes = {
	projectID: PropTypes.string.isRequired,
}





export { SetupRemoteConfigFields }
