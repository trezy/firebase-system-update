// Module imports
import * as firebase from 'firebase-admin'





async function updateIndexes(options) {
}

async function updateRules(options) {
	const {
		localAdminApp,
		githubCommitSha,
		githubOrg,
		githubRepo,
		project,
		serviceConfig: { rulesPath },
	} = options
	const rawFileDownloadPath = `https://raw.githubusercontent.com/${githubOrg}/${githubRepo}/${githubCommitSha}/${rulesPath}`
	const securityRules = firebase.securityRules(localAdminApp)

	const [
		currentRuleset,
		rulesFileContent,
	] = await Promise.all([
		await securityRules.getFirestoreRuleset(),
		await fetch(rawFileDownloadPath).then(response => response.text())
	])

	if (currentRuleset.source[0].content === rulesFileContent) {
		console.log(`Firestore rules haven't changed for ${project.id}; skipping update.`)
		return
	}

	console.log(`Releasing Firestore rules for ${project.id}...`)
	await securityRules.releaseFirestoreRulesetFromSource(rulesFileContent)
	console.log(`Released Firestore rules for ${project.id}!`)
}

export async function deployFirestore(options) {
	const { project } = options

	const serviceConfig = project.serviceConfigs.firestore

	const promises = []

	if (serviceConfig.indexesPath) {
		promises.push(updateIndexes({
			...options,
			serviceConfig,
		}))
	}

	if (serviceConfig.rulesPath) {
		promises.push(updateRules({
			...options,
			serviceConfig,
		}))
	}

	return Promise.all(promises)
}
