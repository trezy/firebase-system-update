// Module imports
import { useCallback } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'





// Local imports
import { Button } from 'components/Form/Button'
import { FontAwesomeIcon } from 'components/FontAwesomeIcon'
import { FormButton } from 'components/Form/FormButton'
import { useAppContext } from 'contexts/AppContext'





function ProjectConfigurationFooter(props) {
	const { projectID } = props
	const {
		data: { projects },
		goBack,
	} = useAppContext()

	const project = projects[projectID]

	const back = useCallback(() => goBack(projectID), [])

	const mapSteps = useCallback(step => {
		return (
			<li
				className={classnames({
					'steps-segment': true,
					'is-active': project.currentStep === step.id,
				})}
				key={step.id}>
				<span className="steps-marker">
					{step.isComplete && (
						<span className="icon">
							<FontAwesomeIcon
								fixedWidth
								icon="check" />
						</span>
					)}
				</span>

				<div className="steps-content">
					<p className="heading">{step.label}</p>
				</div>
			</li>
		)
	}, [
		project.currentStep,
		project.steps,
	])

	return (
		<footer className="columns is-mobile panel-footer">
			<div className="column">
				{(project.currentStep !== 'selectServices') && (
					<ul className="has-content-centered has-gaps is-horizontal is-thin steps">
						{project.steps.map(mapSteps)}
					</ul>
				)}
			</div>

			<div className="buttons column is-narrow is-offset-2">
				{(project.currentStep !== 'selectServices') && (
					<Button
						isDisabled={project.isSaving}
						onClick={back}>
						{'Back'}
					</Button>
				)}

				<FormButton
					className={classnames({
						'is-loading': project.isSaving,
						'is-primary': true,
					})}
					isDisabled={project.isSaving}
					type="submit">
					{(project.currentStep === 'setupServiceAccount') ? 'Finish' : 'Next'}
				</FormButton>
			</div>
		</footer>
	)
}

ProjectConfigurationFooter.propTypes = {
	projectID: PropTypes.string.isRequired,
}





export { ProjectConfigurationFooter }
