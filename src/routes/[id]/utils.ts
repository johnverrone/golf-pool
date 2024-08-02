import type { Entry } from '$lib/api/pools';

export function getPicks(data: FormData): Entry['picks'] {
	const picks: Entry['picks'] = [];

	for (const [key, value] of data.entries()) {
		// get players
		if (/^tier-\d+-players$/.test(key)) {
			let players = value as string;
			players = players.replaceAll(/["[\]]/g, '');
			picks.push(...players.split(','));
		}
	}

	return picks;
}
