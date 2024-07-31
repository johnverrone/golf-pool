import { getLeaderboard } from '$lib/api/espn';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const leaderboard = await getLeaderboard(fetch);

	return {
		leaderboard
	};
};
