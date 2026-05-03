import features from '../features.json' with { type: 'json' }

export type FeatureEnv = 'development' | 'production'

export type FeatureName = keyof typeof features

export type Features = {
	[K in FeatureName]: [FeatureEnv?, FeatureEnv?]
}

// Keep in sync with the equivalent function in data/environment.js
export function getEnvironment(): FeatureEnv {
	if (process.env.NODE_ENV) return process.env.NODE_ENV
	if (process.env.ELEVENTY_RUN_MODE === 'build') return 'production'
	return 'development'
}

// Keep in sync with the equivalent function in data/environment.js
export function isFeatureEnabled(feature: FeatureName) {
	if (!(feature in features)) {
		throw new Error(`Feature ${feature} not found in features.json`)
	}

	return features[feature].includes(getEnvironment())
}
