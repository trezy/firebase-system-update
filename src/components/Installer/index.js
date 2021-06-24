// Local imports
import { Button } from 'components/Form/Button'
import { ConfigureProjects } from 'components/Installer/ConfigureProjects'
import { Header } from 'components/Header'
import { Initialization } from 'components/Installer/Initialization'
import { useAppContext } from 'contexts/AppContext'
import classNames from 'classnames'





export function Installer() {
	const {
		cancelConfiguration,
		data: { projects },
		finishConfiguration,
		states: {
			isConfigured,
			isInstalled,
		},
	} = useAppContext()

	const projectsArray = Object.values(projects || {})
	const configuredProjectCount = projectsArray.reduce((accumulator, project) => {
		if (project.steps.every(step => step.isComplete)) {
			return accumulator + 1
		}

		return accumulator
	}, 0) ?? 0

	return (
		<section className="hero is-fullheight">
			<div className="hero-head">
				<Header />
			</div>

			{!isInstalled && (
				<Initialization />
			)}

			{(isInstalled && !isConfigured) && (
				<ConfigureProjects />
			)}

			{Boolean(projectsArray.length) && (
				<div className="hero-foot">
					<div className="is-align-items-center is-flex is-justify-content-space-between is-radiusless notification">
						<span
							className={classNames({
								'is-info': configuredProjectCount < projectsArray.length,
								'is-light': configuredProjectCount === 0,
								'is-success': configuredProjectCount === projectsArray.length,
								'tag': true,
							})}>
							{configuredProjectCount}{' / '}{projectsArray.length}
							{' Projects Configured'}
						</span>

						<div className="buttons">
							<Button onClick={cancelConfiguration}>
								{'Cancel'}
							</Button>

							<Button
								className="is-success"
								onClick={finishConfiguration}>
								{'Finish'}
							</Button>
						</div>
					</div>
				</div>
			)}
		</section>
	)
}
