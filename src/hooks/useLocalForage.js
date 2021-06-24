// Module imports
import LocalForage from 'localforage'





// Variables
let isConfigured = false





export function useLocalForage() {
	if (typeof window !== 'undefined') {
		if (!isConfigured) {
			LocalForage.config({ name: 'Firebase System Update' })
		}

		return LocalForage
	}
}
