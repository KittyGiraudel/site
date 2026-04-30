import features from '../features.json' with { type: 'json' }

export type FeatureEnv = 'development' | 'production'

export type FeatureName = keyof typeof features

export type Features = {
	[K in FeatureName]: [FeatureEnv?, FeatureEnv?]
}
