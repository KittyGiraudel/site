import {
	getEnvironment as getEnvironmentImpl,
	isFeatureEnabled as isFeatureEnabledImpl,
} from '../data/environment.js'
import features from '../features.json' with { type: 'json' }

export type FeatureEnv = 'development' | 'production'

export type FeatureName = keyof typeof features

export type Features = {
	[K in FeatureName]: [FeatureEnv?, FeatureEnv?]
}

export const getEnvironment = getEnvironmentImpl as () => FeatureEnv

export const isFeatureEnabled = isFeatureEnabledImpl as (feature: FeatureName) => boolean
