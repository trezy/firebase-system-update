// Module imports
import {
	useCallback,
	useEffect,
	useState,
} from 'react'
import PropTypes from 'prop-types'





// Local imports
import { Button } from 'components/Form/Button'
import { FontAwesomeIcon } from 'components/FontAwesomeIcon'
import { useAppContext } from 'contexts/AppContext'
import * as Github from 'helpers/github'





function GithubExplorer(props) {
	const {
		onSelect,
		projectID,
		title,
	} = props
	const {
		data: { projects },
	} = useAppContext()

	const project = projects[projectID]

	const [currentPath, setCurrentPath] = useState('')
	const [directoryListing, setDirectoryListing] = useState(null)

	const back = useCallback(() => {
		setCurrentPath(previousState => {
			const pathArray = previousState.split('/')
			return pathArray.slice(0, pathArray.length - 1).join('/')
		})
	}, [setCurrentPath])

	const getDirectoryToList = useCallback(() => {
		if (!currentPath) {
			return directoryListing
		}

		const pathArray = currentPath.split('/')

		return pathArray.reduce((accumulator, pathSegment) => {
			if (accumulator.currentPath) {
				accumulator.currentPath += `/${pathSegment}`
			} else {
				accumulator.currentPath = pathSegment
			}

			accumulator.currentDirectory = accumulator.currentDirectory.find(item => {
				return item.path === accumulator.currentPath
			}).contents

			return accumulator
		}, {
			currentDirectory: directoryListing,
			currentPath: '',
		}).currentDirectory
	}, [
		currentPath,
		directoryListing,
	])

	const go = useCallback(path => {
		setCurrentPath(path)
	}, [setCurrentPath])

	const mapDirectoryListing = useCallback(item => {
		if (item.type === 'dir') {
			return (
				<Button
					className="panel-block"
					isStyled={false}
					key={item.sha}
					onClick={() => go(item.path)}>
					<span className="panel-icon">
						<FontAwesomeIcon
							fixedWidth
							icon="folder" />
					</span>

					{item.name}
				</Button>
			)
		}

		return (
			<div
				className="panel-block"
				key={item.sha}>
				<span className="panel-icon">
					<FontAwesomeIcon
						fixedWidth
						icon="file" />
				</span>

				{item.name}

				<div className="panel-block-right">
					<Button
						className="is-small"
						onClick={() => onSelect(item.path)}>
						Select
					</Button>
				</div>
			</div>
		)
	}, [])

	const sortDirectoryListing = useCallback((a, b) => {
		if (a.type === b.type) {
			return 0
		}

		if (a.type === 'dir') {
			return -1
		}

		return 1
	}, [])

	useEffect(async () => {
		const repoContents = await Github.getRepoContentsAtPath(project.link.org, project.link.repo, currentPath)
		const repoContentsJSON = await repoContents.json()
		console.log({
			repoContentsJSON,
		})
		setDirectoryListing(previousState => {
			if (!currentPath) {
				return repoContentsJSON.sort(sortDirectoryListing)
			}

			const newState = [...previousState]

			const parentDirectoryIndex = newState.findIndex(item => item.path === currentPath)
			const parentDirectory = { ...newState[parentDirectoryIndex] }

			parentDirectory.contents = repoContentsJSON
			newState[parentDirectoryIndex] = parentDirectory

			return newState
		})
	}, [currentPath])

	const directoryToList = getDirectoryToList()

	return (
		<div className="is-relative panel">
			<div className="is-sticky panel-heading">
				{title}
			</div>

			{!directoryListing && (
				<div className="panel-block">
					{'Loading repo contents...'}
				</div>
			)}

			{(directoryListing && currentPath) && (
				<Button
					className="panel-block"
					isStyled={false}
					onClick={back}>
					<span className="panel-icon">
						<FontAwesomeIcon
							fixedWidth
							icon="chevron-left" />
					</span>
					{'..'}
				</Button>
			)}

			{directoryToList && directoryToList.map(mapDirectoryListing)}
		</div>
	)
}

GithubExplorer.defaultProps = {
	title: 'Github Explorer!',
}

GithubExplorer.propTypes = {
	onSelect: PropTypes.func.isRequired,
	projectID: PropTypes.string.isRequired,
	title: PropTypes.string,
}





export { GithubExplorer }
