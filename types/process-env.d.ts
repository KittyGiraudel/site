declare namespace NodeJS {
	// We treat `NODE_ENV` as an application-level contract: the codebase only
	// supports the `development` and `production` environments.
	interface ProcessEnv {
		NODE_ENV: 'development' | 'production'
	}
}
