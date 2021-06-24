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





function SetupRealtimeDatabaseFields(props) {
	const { projectID } = props
	const { changeStepCompletion } = useAppContext()
	const {
		updateValue,
		values,
	} = useForm()

	const deselectRulesFile = useCallback(() => {
		updateValue('realtimeDatabase::rulesPath', '')
	}, [updateValue])

	const selectRulesFile = useCallback(itemPath => {
		updateValue('realtimeDatabase::rulesPath', itemPath)
	}, [updateValue])

	useEffect(() => {
		const isComplete = Boolean(values['realtimeDatabase::rulesPath'])
		changeStepCompletion(projectID, 'setup::realtimeDatabase', isComplete)
	}, [
		changeStepCompletion,
		projectID,
		values,
	])

	return (
		<>
			<h3 className="heading">
				{'Configure Realtime Database'}
			</h3>

			{!values['realtimeDatabase::rulesPath'] && (
				<GithubExplorer
					onSelect={selectRulesFile}
					projectID={projectID}
					title="Select your Realtime Database rules file" />
			)}

			{Boolean(values['realtimeDatabase::rulesPath']) && (
				<Field
					id="realtimeDatabase::rulesPath"
					label="Path to Realtime Database rules">
					<FieldInput
						className="is-fullwidth"
						id="realtimeDatabase::rulesPath"
						isDisabled
						readOnly />

					<div className="control">
						<FormButton
							className="is-primary"
							onClick={deselectRulesFile}>
							{'Change'}
						</FormButton>
					</div>
				</Field>
			)}
		</>
	)
}

SetupRealtimeDatabaseFields.propTypes = {
	projectID: PropTypes.string.isRequired,
}





export { SetupRealtimeDatabaseFields }
