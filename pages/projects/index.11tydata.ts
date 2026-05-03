import type { CardGridItem, Project } from '../../types/eleventy.ts'

export default {
	eleventyComputed: {
		project_cards(data: { collections: { projects: Project[] } }): CardGridItem[] {
			return data.collections.projects.map(project => {
				const url = project.url || undefined
				const data = project.data

				return {
					primary: data.title,
					secondary: data.description ?? '',
					image: data.image,
					image_alt: data.title,
					url,
					vt_source: url,
					tags: data.tags,
				}
			})
		},
	},
}
