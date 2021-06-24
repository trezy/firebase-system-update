// Module imports
import { useEffect } from 'react'
import PropTypes from 'prop-types'





// Local imports
import { useForm } from 'components/Form'





function FieldHidden(props) {
	const {
		autocomplete,
		id,
	} = props
	const {
		updateValidity,
		values,
	} = useForm()

	useEffect(() => updateValidity(id, []), [])

	return (
		<input
			autoComplete={autocomplete}
			type="hidden"
			value={values[id]} />
	)
}

FieldHidden.propTypes = {
	autocomplete: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
}

export { FieldHidden }
