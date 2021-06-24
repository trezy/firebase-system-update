// Local imports
import { Field } from 'components/Form/Field'
import { FieldCheckbox } from 'components/Form/FieldCheckbox'





export function SelectServicesFields() {
	return (
		<>
			<h3 className="heading">
				{'Select which Firebase services you would like to have automatically deployed'}
			</h3>

			<Field id="firestoreIsEnabled">
				<FieldCheckbox
					id="firestoreIsEnabled"
					label="Firestore" />
			</Field>

			<Field id="realtimeDatabaseIsEnabled">
				<FieldCheckbox
					id="realtimeDatabaseIsEnabled"
					label="Realtime Database" />
			</Field>

			<Field id="remoteConfigIsEnabled">
				<FieldCheckbox
					id="remoteConfigIsEnabled"
					label="Remote Config" />
			</Field>

			<Field id="storageIsEnabled">
				<FieldCheckbox
					id="storageIsEnabled"
					label="Storage" />
			</Field>
		</>
	)
}
