// Module imports
import PropTypes from 'prop-types'





// Local imports
import { FontAwesomeIcon } from 'components/FontAwesomeIcon'
import { useAppContext } from 'contexts/AppContext'





function ProjectSummary(props) {
	const {
		projectID,
		onOpen,
	} = props
	const {
		data: { projects },
	} = useAppContext()

	const project = projects[projectID]
	const isConfigured = project.steps.every(step => step.isComplete)

	return (
		<li
			className="card mb-4"
			key={projectID}>
			<div className="card-content">
				<div className="media">
					<figure className="media-left">
						<p className="image is-64x64">
							<img src="https://bulma.io/images/placeholders/128x128.png" />
						</p>
					</figure>

					<div className="media-content">
						<p className="title is-4">{project.name}</p>
						<p className="subtitle is-6">{project.link.org}/{project.link.repo}</p>
					</div>

					{isConfigured && (
						<div className="media-right has-text-success">
							<span className="fa-layers">
								<FontAwesomeIcon icon="circle" />
								<FontAwesomeIcon
									icon="check"
									inverse
									transform="shrink-6" />
							</span>
							{' Configured!'}
						</div>
					)}
				</div>
			</div>

			<footer className="card-footer">
				<button
					className="card-footer-item"
					onClick={onOpen}>
						{'Configure '}
						<span className="icon">
							<FontAwesomeIcon
								fixedWidth
								icon="chevron-right"
								size="sm" />
						</span>
				</button>
			</footer>
		</li>
	)
}

ProjectSummary.propTypes = {
	projectID: PropTypes.string.isRequired,
	onOpen: PropTypes.func.isRequired,
}

export { ProjectSummary }
