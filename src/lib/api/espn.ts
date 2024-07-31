interface Leaderboard {
	name: string;
	players: {
		name: string;
		score: number;
		displayScore: string;
	}[];
}

interface ESPNResponseType {
	name: string;
	competitions: {
		competitors: {
			athlete: {
				$ref: string;
			};
			score: {
				$ref: string;
			};
		}[];
	}[];
}

export async function getLeaderboard(f: typeof fetch): Promise<Leaderboard> {
	const req = await f(
		'https://sports.core.api.espn.com/v2/sports/golf/leagues/pga/events/401580360?lang=en&region=us'
	);
	const data = (await req.json()) as ESPNResponseType;

	return {
		name: data.name,
		players: await Promise.all(
			data.competitions[0].competitors.map(async (c) => {
				const athleteReq = await f(c.athlete['$ref']);
				const athlete = await athleteReq.json();

				const scoreReq = await f(c.score['$ref']);
				const score = await scoreReq.json();

				return {
					name: athlete.fullName,
					score: score.value,
					displayScore: score.displayValue
				};
			})
		)
	};
}
