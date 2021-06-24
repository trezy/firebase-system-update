// Module imports
import { useCallback } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'





// Local imports
import { useForm } from 'components/Form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'





function FieldFile(props) {
	const {
		accept,
		className,
		filename,
		id,
		isDisabled,
		isRequired,
		label,
		onChange,
	} = props
	const {
		errors: formErrors,
		updateValidity,
		updateValue,
		values,
	} = useForm()

	const validate = useCallback(async (state, initialProps) => {
		// const errors = []

		// if (typeof initialProps.validate === 'function') {
		// 	const customError = await initialProps.validate(state, values)
		// 	if (customError) {
		// 		errors.push(customError)
		// 	}
		// }

		// updateValidity(id, errors)
	}, [
		updateValidity,
		values,
	])

	const handleChange = useCallback(event => {
		onChange(event.target.files?.[0])

		// let value = event.target.checked
		// updateValue(id, value)
		// validate(value, props)
	}, [
		id,
		onChange,
		updateValue,
		validate,
	])

	// useEffect(() => updateValidity(id, []), [])

	return (
		<div
			className={classnames(className, {
				file: true,
				'has-name': Boolean(filename),
				'is-boxed': true,
				'is-fullwidth': true,
			})}>
			<label className="file-label">
				<input
					accept={accept}
					className="file-input"
					disabled={isDisabled}
					id={id}
					onChange={handleChange}
					required={isRequired}
					type="file" />

				<span className="file-cta">
					<span className="file-icon">
						<FontAwesomeIcon
							fixedWidth
							icon="upload" />
					</span>

					<span className="file-label has-text-centered">
						{label}
					</span>
				</span>

				{Boolean(filename) && (
					<span className="file-name">
						{filename}
					</span>
				)}
			</label>
		</div>
	)
}

FieldFile.defaultProps = {
	accept: null,
	className: null,
	filename: '',
	isDisabled: false,
	isRequired: false,
	label: null,
	onChange: () => {},
	validate: () => {},
}

FieldFile.propTypes = {
	accept: PropTypes.string,
	className: PropTypes.string,
	filename: PropTypes.string,
	id: PropTypes.string.isRequired,
	isDisabled: PropTypes.bool,
	isRequired: PropTypes.bool,
	label: PropTypes.string,
	onChange: PropTypes.func,
	validate: PropTypes.func,
}

export { FieldFile }
