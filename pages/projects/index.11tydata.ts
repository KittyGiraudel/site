import projectsJson from '../../data/projects.json' with { type: 'json' }
import type { CardGridItem } from '../../types/eleventy.ts'

type Project = (typeof projectsJson)[number]

export default {
	eleventyComputed: {
		project_cards(data: { projects: Project[] }): CardGridItem[] {
			return data.projects.map(p => {
				const url = (p.detail_url ?? p.link) || undefined
				return {
					primary: p.name,
					secondary: p.description,
					image: p.image,
					image_alt: p.name,
					url,
					vt_source: url,
					tags: p.tags,
				}
			})
		},
	},
}
