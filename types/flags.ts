import flagsJson from '../flags.json' with { type: 'json' }

export type FeatureEnv = 'development' | 'production'

export type FeatureFlagName = keyof typeof flagsJson

export type FeatureFlags = {
	[K in FeatureFlagName]: FeatureEnv[]
}
