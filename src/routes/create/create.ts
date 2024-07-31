export interface TierInfo {
	tier_num: number;
	required_picks: number;
	players: string[];
}

export function getTierInfo(data: FormData): TierInfo[] {
	const tierArray: TierInfo[] = [];

	for (const [key, value] of data.entries()) {
		// get players
		if (/^tier-\d+-players$/.test(key)) {
			const tier_num = parseInt(key.at(5) ?? '', 10);
			const players = value
				.toString()
				.split('\n')
				.map((v) => v.trim())
				.filter((v) => v);

			const t = tierArray.find((t) => t.tier_num === tier_num);
			if (t) {
				t.players = players;
			} else {
				tierArray.push({ tier_num, players, required_picks: 0 });
			}
		}

		// get required picks
		if (/^tier-\d+-required$/.test(key)) {
			const tier_num = parseInt(key.at(5) ?? '', 10);
			const required_picks = parseInt(value.toString(), 10);

			const t = tierArray.find((t) => t.tier_num === tier_num);
			if (t) {
				t.required_picks = required_picks;
			} else {
				tierArray.push({ tier_num, required_picks, players: [] });
			}
		}
	}

	return tierArray;
}
