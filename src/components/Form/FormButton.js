// Module imports
import PropTypes from 'prop-types'





// Local imports
import { Button } from 'components/Form/Button'
import { useForm } from 'components/Form'





function FormButton(props) {
	const { children } = props
	const {
		isTouched,
		isValid,
	} = useForm()

	let isDisabled = props.isDisabled

	if (typeof props.isDisabled === 'undefined') {
		isDisabled = !isValid || !isTouched
	}

	return (
		<Button
			{...props}
			isDisabled={isDisabled}>
			{children}
		</Button>
	)
}

FormButton.defaultProps = {
	isDisabled: false,
}

FormButton.propTypes = {
	children: PropTypes.node.isRequired,
	isDisabled: PropTypes.bool,
}

export { FormButton }
