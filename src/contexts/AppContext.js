// Module imports
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useReducer,
} from 'react'
// import {
// 	collection as firestoreCollection,
// 	doc as firestoreDoc,
// 	onSnapshot as onFirestoreSnapshot,
// } from 'firebase/firestore'
import PropTypes from 'prop-types'





// Local imports
// import { firestore } from 'helpers/firebase'
import * as API from 'helpers/api'
import * as Cookies from 'helpers/Cookies'





// Constants
const ALL_STEPS = {
	selectServices: 'Choose Firebase Services',
	'setup::realtimeDatabase': 'Setup Realtime Database',
	'setup::firestore': 'Setup Firestore',
	'setup::remoteConfig': 'Setup Remote Config',
	'setup::storage': 'Setup Firebase Storage',
	setupServiceAccount: 'Setup Your Service Account',
}
const INITIAL_STATE = {
	data: {
		code: null,
		configurationID: null,
		projects: null,
		nextURL: null,
		teamID: null,
	},

	states: {
		areProjectsLoaded: false,
		isConfigured: false,
		isConfiguring: false,
		isInstalled: false,
		isInstalling: false,
		isLoaded: false,
		isLoading: true,
		isSaving: false,
		isUpdatingProjects: false,
	},
}





function reducer(state, action) {
	const {
		payload,
		type,
	} = action
	const newState = {
		data: {
			...INITIAL_STATE.data,
			...state.data,
		},

		states: {
			...INITIAL_STATE.states,
			...state.states,
		},
	}

	switch (type) {
		case 'app installed':
			Cookies.set('vercelAccessToken', payload.accessToken, {
				maxAge: 60 * 60 * 24 * 30,
				path: '/',
			})
			newState.data.projects = Object
				.entries(payload.projects)
				.reduce((accumulator, [id, project]) => {
					accumulator[id] = {
						...project,
						currentStep: 'selectServices',
						isSaving: false,
						steps: [
							{
								id: 'selectServices',
								isComplete: false,
								label: ALL_STEPS.selectServices,
							},
						],
					}
					return accumulator
				}, {})
			newState.states.isInstalled = true
			newState.states.isInstalling = false
			break

		case 'change step completion':
			{
				const project = { ...newState.data.projects[payload.projectID] }

				project.steps = [...project.steps]

				const stepIndex = project.steps.findIndex(({ id }) => id === payload.stepID)
				const step = { ...project.steps[stepIndex] }

				step.isComplete = payload.isComplete

				project.steps[stepIndex] = step
				newState.data.projects[payload.projectID] = project
			}
			break

		case 'finish project configuration':
			{
				newState.data.projects = { ...newState.data.projects }
				const project = { ...newState.data.projects[payload.projectID] }
				const finalStepIndex = project.steps.length - 1
				const finalStep = { ...project.steps[finalStepIndex] }

				finalStep.isComplete = true
				project.serviceAccountJSON = payload.serviceAccountJSON
				project.steps[finalStepIndex] = finalStep
				newState.data.projects[payload.projectID] = project
			}
			break

		case 'go back':
			{
				const project = { ...newState.data.projects[payload.projectID] }

				const currentStepIndex = project.steps.findIndex(({ id }) => id === project.currentStep)

				project.currentStep = project.steps[currentStepIndex - 1].id

				newState.data.projects[payload.projectID] = project
			}
			break

		case 'installing app':
			newState.states.isInstalling = true
			break

		case 'load configuration data':
			newState.data.code = payload.code
			newState.data.configurationID = payload.configurationID
			newState.data.nextURL = decodeURIComponent(payload.next)
			newState.data.teamID = payload.teamID

			newState.states.isLoaded = true
			newState.states.isLoading = false
			break

		case 'save project':
			newState.states.isSaving = true
			newState.data.projects[payload.projectID] = {
				...newState.data.projects[payload.projectID],
				isSaving: true,
			}
			break

		case 'saved project':
			newState.states.isSaving = false
			newState.data.projects[payload.projectID] = {
				...newState.data.projects[payload.projectID],
				isSaving: false,
			}
			break

		case 'update project service config':
			{
				const project = { ...newState.data.projects[payload.projectID] }

				project.serviceConfigs[payload.service] = payload.serviceConfig

				const currentStepIndex = project.steps.findIndex(({ id }) => id === project.currentStep)

				if (currentStepIndex < (project.steps.length - 1)) {
					project.currentStep = project.steps[currentStepIndex + 1].id
				}

				newState.data.projects[payload.projectID] = project
			}
			break

		case 'update project services':
			{
				const project = { ...newState.data.projects[payload.projectID] }

				project.steps[0].isComplete = true

				Object.entries(payload.serviceStates).forEach(([service, isEnabled]) => {
					const stepID = `setup::${service}`
					project.serviceConfigs[service].isEnabled = isEnabled

					if (isEnabled) {
						project.steps.push({
							id: stepID,
							isComplete: false,
							label: ALL_STEPS[stepID],
						})

						if (!project.currentStep.startsWith('setup::')) {
							project.currentStep = stepID
						}
					}
				})

				project.steps.push({
					id: 'setupServiceAccount',
					isComplete: false,
					label: ALL_STEPS.setupServiceAccount,
				})

				newState.data.projects[payload.projectID] = project
			}
			break

		case 'update projects':
			newState.data.projects = payload
			newState.states.areProjectsLoaded = true
			newState.states.isUpdatingProjects = false
			break

		case 'updating projects':
			newState.states.isUpdatingProjects = true
			break

		default:
			console.warn(`Unrecognized action dispatched: ${type}`, payload)
			return state
	}

	console.log(type, newState)

	return newState
}





const AppContext = createContext({
	...INITIAL_STATE,
	cancelConfiguration: () => {},
	changeStepCompletion: () => {},
	finishConfiguration: () => {},
	finishProjectConfiguration: () => {},
	finishSaving: () => {},
	goBack: () => {},
	loadConfigurationData: () => {},
	startSaving: () => {},
	updateProjectServiceConfig: () => {},
	updateProjectServices: () => {},
})

const AppContextProvider = props => {
	const {
		children,
		code,
		configurationID,
		next,
		teamID,
	} = props
	const [state, dispatch] = useReducer(reducer, { ...INITIAL_STATE })

	const cancelConfiguration = useCallback(() => window.close(), [])

	const changeStepCompletion = useCallback((projectID, stepID, isComplete) => {
		dispatch({
			payload: {
				isComplete,
				projectID,
				stepID,
			},
			type: 'change step completion',
		})
	}, [dispatch])

	const finishConfiguration = useCallback(() => {
		window.location = state.data.nextURL
	}, [state.data.nextURL])

	const finishProjectConfiguration = useCallback((projectID, serviceAccountJSON) => {
		dispatch({
			payload: {
				projectID,
				serviceAccountJSON,
			},
			type: 'finish project configuration',
		})
	}, [dispatch])

	const saveProject = useCallback(async (projectID, serviceAccountJSON) => {
		dispatch({
			payload: { projectID },
			type: 'save project',
		})

		const serializedProject = {
			...state.data.projects[projectID],
			serviceAccountJSON,
		}

		delete serializedProject.currentStep
		delete serializedProject.isSaving
		delete serializedProject.steps

		await API.saveProject({
			projectID,
			project: serializedProject,
		})

		dispatch({
			payload: { projectID },
			type: 'saved project',
		})
	}, [
		dispatch,
		state,
	])

	const goBack = useCallback(projectID => {
		dispatch({
			payload: { projectID },
			type: 'go back',
		})
	}, [dispatch])

	const handleProjectsSnapshot = useCallback(snapshot => {
		dispatch({ type: 'updating projects' })

		const projects = {}

		snapshot.docChanges().forEach(change => {
			const {
				doc,
				type,
			} = change

			if (['added', 'modified'].includes(type)) {
				projects[doc.id] = doc.data()
			}
		})

		dispatch({
			payload: projects,
			type: 'update projects',
		})
	}, [dispatch])

	const loadConfigurationData = useCallback(configurationData => {
		dispatch({
			payload: configurationData,
			type: 'load configuration data',
		})
	}, [dispatch])

	const install = useCallback(async () => {
		dispatch({ type: 'installing app' })

		try {
			const response = await API.install({
				code: state.data.code,
				configurationID: state.data.configurationID,
				teamID: state.data.teamID,
			})

			if (response.ok) {
				const responseJSON = await response.json()

				dispatch({
					payload: responseJSON,
					type: 'app installed',
				})
			}
		} catch (error) {
			console.error(error)
		}
	}, [
		dispatch,
		state.data.code,
		state.data.configurationID,
		state.data.teamID,
	])

	const updateProjectServiceConfig = useCallback((projectID, service, serviceConfig) => {
		dispatch({
			payload: {
				projectID,
				service,
				serviceConfig,
			},
			type: 'update project service config',
		})
	}, [dispatch])

	const updateProjectServices = useCallback((projectID, serviceStates) => {
		dispatch({
			payload: {
				projectID,
				serviceStates,
			},
			type: 'update project services',
		})
		// dispatch({
		// 	payload: {
		// 		projectID,
		// 		nextStep: ''
		// 	},
		// 	type: 'next step',
		// })
	}, [dispatch])

	// Initialize configuration data
	useEffect(() => {
		if (!state.states.isLoaded) {
			loadConfigurationData({
				code,
				configurationID,
				next,
				teamID,
			})
		}
	}, [
		code,
		configurationID,
		state.states.isLoaded,
		loadConfigurationData,
		next,
		teamID,
	])

	// Start install if it's not already in progress
	useEffect(() => {
		if (!state.states.isLoading && !state.states.isInstalling && !state.states.isInstalled) {
			install()
		}
	}, [
		install,
		state.states.isInstalled,
		state.states.isInstalling,
		state.states.isLoading,
	])

	// TODO: Figure out why Firstore can't connect
	// Load and watch for changes to projects
	// useEffect(() => {
	// 	const {
	// 		data: {
	// 			configurationID,
	// 		},
	// 		states: {
	// 			isInstalled,
	// 		},
	// 	} = state

	// 	if (isInstalled) {
	// 		const projectsCollection = firestoreCollection(firestore, 'configurations', configurationID, 'projects')
	// 		return onFirestoreSnapshot(projectsCollection, handleProjectsSnapshot)
	// 	}
	// }, [
	// 	handleProjectsSnapshot,
	// 	state.data.configurationID,
	// 	state.states.isInstalled,
	// ])

	return (
		<AppContext.Provider
			value={{
				...state,
				cancelConfiguration,
				changeStepCompletion,
				finishConfiguration,
				finishProjectConfiguration,
				goBack,
				loadConfigurationData,
				saveProject,
				updateProjectServiceConfig,
				updateProjectServices,
			}}>
			{children}
		</AppContext.Provider>
	)
}

AppContextProvider.propTypes = {
	children: PropTypes.node.isRequired,
}

const useAppContext = () => useContext(AppContext)





export {
	AppContext,
	AppContextProvider,
	useAppContext,
}
