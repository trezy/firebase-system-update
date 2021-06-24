// Local imports
import { FontAwesomeIcon } from 'components/FontAwesomeIcon'
import { useAppContext } from 'contexts/AppContext'





export function Initialization() {
	const {
		states: {
			isInstalled,
			isInstalling,
			isLoading,
		},
	} = useAppContext()

	return (
		<div className="hero-body is-relative is-scrollable">
			<div className="container has-text-centered">
				<p className="title">
					{isLoading && 'Loading...'}
					{isInstalling && 'Installing...'}
					{isInstalled && 'Installed'}
				</p>

				<p className="subtitle">
					<FontAwesomeIcon
						fixedWidth
						icon='spinner'
						pulse />
				</p>
			</div>
		</div>
	)
}
