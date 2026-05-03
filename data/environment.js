import FEATURES from '../features.json' with { type: 'json' }

// Keep in sync with the equivalent function in types/features.ts
export function getEnvironment() {
	if (process.env.NODE_ENV) return process.env.NODE_ENV
	if (process.env.ELEVENTY_RUN_MODE === 'build') return 'production'
	return 'development'
}

// Keep in sync with the equivalent function in types/features.ts
export function isFeatureEnabled(feature) {
	if (!(feature in FEATURES)) {
		throw new Error(`Feature ${feature} not found in features.json`)
	}

	return FEATURES[feature].includes(getEnvironment())
}
