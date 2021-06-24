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





function SetupStorageFields(props) {
	const { projectID } = props
	const { changeStepCompletion } = useAppContext()
	const {
		updateValue,
		values,
	} = useForm()

	const deselectRulesFile = useCallback(() => {
		updateValue('storage::rulesPath', '')
	}, [updateValue])

	const selectRulesFile = useCallback(itemPath => {
		updateValue('storage::rulesPath', itemPath)
	}, [updateValue])

	useEffect(() => {
		const isComplete = Boolean(values['storage::rulesPath'])
		changeStepCompletion(projectID, 'setup::storage', isComplete)
	}, [
		changeStepCompletion,
		projectID,
		values,
	])

	return (
		<>
			<h3 className="heading">
				{'Configure Firebase Storage'}
			</h3>

			{!values['storage::rulesPath'] && (
				<GithubExplorer
					onSelect={selectRulesFile}
					projectID={projectID}
					title="Select your Firebase Storage rules file" />
			)}

			{Boolean(values['storage::rulesPath']) && (
				<Field
					id="storage::rulesPath"
					label="Path to Firebase Storage rules">
					<FieldInput
						className="is-fullwidth"
						id="storage::rulesPath"
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

SetupStorageFields.propTypes = {
	projectID: PropTypes.string.isRequired,
}





export { SetupStorageFields }
