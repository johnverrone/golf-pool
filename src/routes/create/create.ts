import type { Pool } from '$lib/api/pools';

export function getTierInfo(data: FormData): Pool['tiers'] {
	const tierMap: Pool['tiers'] = new Map();

	for (const [key, value] of data.entries()) {
		// get players
		if (/^tier-\d+-players$/.test(key)) {
			const tier_num = parseInt(key.at(5) ?? '', 10);
			const players = value
				.toString()
				.split('\n')
				.map((v) => v.trim())
				.filter((v) => v);

			const t = tierMap.get(tier_num);
			if (t) {
				t.players = players;
			} else {
				tierMap.set(tier_num, { players, required: 0 });
			}
		}

		// get required picks
		if (/^tier-\d+-required$/.test(key)) {
			const tier_num = parseInt(key.at(5) ?? '', 10);
			const required_picks = parseInt(value.toString(), 10);

			const t = tierMap.get(tier_num);
			if (t) {
				t.required = required_picks;
			} else {
				tierMap.set(tier_num, { required: required_picks, players: [] });
			}
		}
	}

	return tierMap;
}
