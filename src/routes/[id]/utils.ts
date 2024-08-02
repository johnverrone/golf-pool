import type { Entry } from '$lib/api/pools';

export function getPicks(data: FormData): Entry['picks'] {
	const picks: Entry['picks'] = [];

	for (const [key, value] of data.entries()) {
		// get players
		if (/^tier-\d+-players$/.test(key)) {
			const players = value as string;
			picks.push(...players.split(','));
		}
	}

	return picks;
}
