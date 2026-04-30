import FEATURES from '../features.json' with { type: 'json' }

const ENV = process.env.NODE_ENV

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
	environment: process.env.NODE_ENV,
	time: new Date(),
	pubDate: new Date(2012, 10, 10),
	job_notice: {
		text: 'I am currently looking for a new role!',
		url: 'https://www.linkedin.com/posts/kitty-giraudel_dear-network-im-still-looking-for-my-next-activity-7451986756494663680-6Br8',
	},
	nav: [
		{ path: '/blog/', label: 'Blog' },
		{ path: '/projects/', label: 'Projects' },
		{ path: '/snippets/', label: 'Snippets' },
		{ path: '/talks/', label: 'Talks' },
		{ path: '/about/', label: 'About' },
		{ path: '/resume/', label: 'Hire me' },
	],
	configuration: {
		inline_assets: FEATURES.inlineAssets.includes(ENV),
		render_drafts: FEATURES.renderDrafts.includes(ENV),
		service_worker: FEATURES.serviceWorker.includes(ENV),
	},
}
