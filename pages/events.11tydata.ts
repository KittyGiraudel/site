import events from '../data/events.json' with { type: 'json' }
import utilities from '../plugins/utilities.ts'
import type { CardGridItem } from '../types/eleventy.ts'

type EventEntry = (typeof events)[number]

export default {
	eleventyComputed: {
		event_cards(data: { events: EventEntry[] }): CardGridItem[] {
			return data.events.map(e => {
				return {
					primary: e.event,
					secondary: `${utilities.time(e.date)} · ${e.location}`,
					image: e.thumbnail,
					image_alt: e.event,
					vt_source: e.link,
					actions: e.actions.map(a => ({
						url: a.url,
						label: `${a.label} <span class="visually-hidden">${e.event}</span>`,
					})),
				}
			})
		},
	},
}
