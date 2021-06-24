// Module imports
import {
	useCallback,
	useEffect,
	useState,
} from 'react'
import PropTypes from 'prop-types'





// Local imports
import { Field } from 'components/Form/Field'
import { FieldFile } from 'components/Form/FieldFile'
import { FieldInput } from 'components/Form/FieldInput'
import { useAppContext } from 'contexts/AppContext'
import { useForm } from 'components/Form'





function SetupServiceAccountFields(props) {
	const { projectID } = props
	const { changeStepCompletion } = useAppContext()
	const {
		updateValidity,
		updateValue,
		values,
	} = useForm()
	const [file, setFile] = useState(null)
	const [isEnteringManually, setIsEnteringManually] = useState(false)

	const handleFileSelected = useCallback(selectedFile => {
		setFile(selectedFile)
	}, [setFile])

	const toggleEnterManually = useCallback(() => {
		setIsEnteringManually(previousState => !previousState)
	}, [setIsEnteringManually])

	useEffect(() => {
		const isComplete = Boolean(values['serviceAccountJSON'])
		changeStepCompletion(projectID, 'serviceAccountJSON', isComplete)
	}, [
		changeStepCompletion,
		projectID,
		values,
	])

	useEffect(() => {
		if (file) {
			const reader = new FileReader()
			reader.onload = event => {
				updateValue('serviceAccountJSON', event.target.result)

				try {
					JSON.stringify(event.target.result)
					updateValidity('serviceAccountJSON', [])
				} catch (error) {
					updateValidity('serviceAccountJSON', ['File is invalid; please only upload JSON files.'])
				}
			}
			reader.onerror = error => console.error(error)
			reader.readAsText(file)
		}
	}, [file])

	return (
		<>
			<h3 className="heading">
				{'Configure Service Account'}
			</h3>

			{!isEnteringManually && (
				<Field
					helperText={(
						<button
							className="button is-link is-small"
							onClick={toggleEnterManually}>
							{'Enter JSON manually'}
						</button>
					)}
					id="serviceAccountJSON"
					label="Service Account JSON File">
					<FieldFile
						accept="application/json,text/plain"
						id="serviceAccountJSON"
						label="Choose Service Account File..."
						filename={file?.name}
						onChange={handleFileSelected} />
				</Field>
			)}

			{isEnteringManually && (
				<Field
					helperText={(
						<button
							className="button is-link is-small"
							onClick={toggleEnterManually}>
							{'Upload JSON file'}
						</button>
					)}
					id="serviceAccountJSON"
					label="Service Account JSON">
					<FieldInput
						id="serviceAccountJSON"
						isMultiline
						isPreformatted
						placeholder={`{
	"type": "service_account",
	"project_id": "...",
	"private_key_id": "...",
	"private_key": "...",
	"client_email": "...",
	"client_id": "...",
	"auth_uri": "...",
	"token_uri": "...",
	"auth_provider_x509_cert_url": "...",
	"client_x509_cert_url": "..."
}`}
						rows={14} />
				</Field>
			)}
		</>
	)
}

SetupServiceAccountFields.propTypes = {
	projectID: PropTypes.string.isRequired,
}





export { SetupServiceAccountFields }
