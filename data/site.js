import { getEnvironment, isFeatureEnabled } from './environment.js'

export default {
	url: 'https://kittygiraudel.com',
	description:
		'I’m Kitty Giraudel, a transfeminine web engineer based in Berlin, focused on accessibility and inclusivity.',
	author: 'Kitty Giraudel',
	same_as: [
		'https://github.com/KittyGiraudel',
		'https://x.com/KittyGiraudel',
		'https://www.linkedin.com/in/kittygiraudel/',
		'https://www.sanity.io/exchange/community/kittygiraudel',
		'https://css-tricks.com/author/kittygiraudel/',
		'https://www.npmjs.com/~kittygiraudel',
		'https://www.sitepoint.com/author/kittygiraudel/',
		'https://bsky.app/profile/kittygiraudel.com',
		'https://noti.st/kittygiraudel',
		'https://www.smashingmagazine.com/author/kitty-giraudel/',
		'https://11tybundle.dev/authors/kitty-giraudel/',
		'https://codepen.io/KittyGiraudel',
		'https://app.daily.dev/kittygiraudel',
		'https://speakerdeck.com/kittygiraudel',
		'https://tympanus.net/codrops/author/kittygiraudel/',
	],
	environment: getEnvironment(),
	time: new Date(),
	pubDate: new Date(2012, 10, 10),
	job_notice: {
		text: 'I am currently looking for a new role!',
		url: 'https://www.linkedin.com/posts/kitty-giraudel_dear-network-im-still-looking-for-my-next-activity-7451986756494663680-6Br8',
	},
	nav: [
		{ path: '/blog/', label: 'Blog' },
		{ path: '/snippets/', label: 'Snippets' },
		{ path: '/projects/', label: 'Projects' },
		{ path: '/talks/', label: 'Talks' },
		{ path: '/about/', label: 'About' },
		{ path: '/resume/', label: 'Hire me' },
	],
	configuration: {
		// ELEVENTY_RUN_MODE is either `build`, `watch` or `serve`:
		// - `serve` is set when using `--serve`, which is what `npm start` does
		// - `watch` is set when using `--watch`, which we don’t use
		// - `build` is set when building the website, i.e. `npm run build`
		dev_mode: process.env.ELEVENTY_RUN_MODE !== 'build',
		inline_assets: isFeatureEnabled('inlineAssets'),
		render_drafts: isFeatureEnabled('renderDrafts'),
		service_worker: isFeatureEnabled('serviceWorker'),
	},
}
