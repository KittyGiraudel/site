import { execSync } from 'node:child_process'

let cache = {
	head: null,
	dates: {},
}

function getHead() {
	return execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim()
}

// Build a file path to `Date` map from one `git log` call
// See: https://meiert.com/blog/eleventy-git-last-modified/
export default function () {
	let head = null
	try {
		head = getHead()
		if (cache.head === head) return cache.dates
	} catch {
		// Git unavailable or not a repo
		return cache.dates
	}

	const dates = {}
	try {
		// --diff-filter=M captures only genuine edits, ignoring renames/additions/deletions.
		// --name-status gives us "M\tpath" lines instead of bare paths.
		const log = execSync(
			'git log --format="DATE:%ci" --diff-filter=M --name-status -- _posts/*.md posts/*.md',
			{
				encoding: 'utf8',
				maxBuffer: 50 * 1024 * 1024,
			},
		)
		let currentDate = null
		for (const line of log.split('\n')) {
			if (line.startsWith('DATE:')) {
				currentDate = new Date(line.slice(5).trim())
			} else if (line.startsWith('M\t') && currentDate) {
				// Commits are newest-first;
				// first occurrence of a path = its last modification.
				// Normalise the legacy `_posts/` prefix so lookups always use `posts/`.
				const key = line
					.slice(2)
					.trim()
					.replace(/^_posts\//, 'posts/')
				if (!dates[key]) {
					dates[key] = currentDate
				}
			}
		}
	} catch {
		// Git unavailable or not a repo
	}

	cache = { head, dates }
	return dates
}
