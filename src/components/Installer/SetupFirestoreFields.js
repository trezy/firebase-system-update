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





function SetupFirestoreFields(props) {
	const { projectID } = props
	const { changeStepCompletion } = useAppContext()
	const {
		updateValue,
		values,
	} = useForm()

	const deselectIndexesFile = useCallback(() => {
		updateValue('firestore::indexesPath', '')
	}, [updateValue])

	const deselectRulesFile = useCallback(() => {
		updateValue('firestore::rulesPath', '')
	}, [updateValue])

	const selectIndexesFile = useCallback(itemPath => {
		updateValue('firestore::indexesPath', itemPath)
	}, [updateValue])

	const selectRulesFile = useCallback(itemPath => {
		updateValue('firestore::rulesPath', itemPath)
	}, [updateValue])

	useEffect(() => {
		const isComplete = Boolean(values['firestore::indexesPath']) && Boolean(values['firestore::rulesPath'])
		changeStepCompletion(projectID, 'setup::firestore', isComplete)
	}, [
		changeStepCompletion,
		projectID,
		values,
	])

	return (
		<>
			<h3 className="heading">
				{'Configure Firestore'}
			</h3>

			{!values['firestore::rulesPath'] && (
				<GithubExplorer
					onSelect={selectRulesFile}
					projectID={projectID}
					title="Select your Firestore rules file" />
			)}

			{Boolean(values['firestore::rulesPath']) && (
				<Field
					id="firestore::rulesPath"
					label="Path to Firestore rules">
					<FieldInput
						className="is-fullwidth"
						id="firestore::rulesPath"
						isDisabled
						readOnly />

					<div className="control">
						<FormButton
							className="is-primary"
							onClick={deselectRulesFile}>
							Change
						</FormButton>
					</div>
				</Field>
			)}

			{!values['firestore::indexesPath'] && (
				<GithubExplorer
					onSelect={selectIndexesFile}
					projectID={projectID}
					title="Select your Firestore indexes file" />
			)}

			{Boolean(values['firestore::indexesPath']) && (
				<Field
					id="firestore::indexesPath"
					label="Path to Firestore indexes">
					<FieldInput
						className="is-fullwidth"
						id="firestore::indexesPath"
						isDisabled
						readOnly />

					<div className="control">
						<FormButton
							className="is-primary"
							onClick={deselectIndexesFile}>
							{'Change'}
						</FormButton>
					</div>
				</Field>
			)}
		</>
	)
}

SetupFirestoreFields.propTypes = {
	projectID: PropTypes.string.isRequired,
}





export { SetupFirestoreFields }
