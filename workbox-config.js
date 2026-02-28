module.exports = {
	globDirectory: '_site',
	globPatterns: [
		'**/*.{js,txt,html,ico,jpg,png,css,jpeg,gif,svg}'
	],
	swDest: '_site/service-worker.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	],
};