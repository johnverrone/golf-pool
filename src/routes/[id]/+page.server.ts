import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { createEntry, getPoolById } from '$lib/api/pools';
import { getPicks } from './utils';
import { getLeaderboard } from '$lib/api/espn';

export const load: PageServerLoad = async ({ params, fetch }) => {
	try {
		const data = await getPoolById(params.id);
		const leaderboard = await getLeaderboard(fetch, data.espnId);
		// TODO: don't return picks to client before first tee time
		return {
			title: 'Golf Pools',
			leaderboard,
			...data
		};
	} catch (err) {
		console.error(err);
		redirect(307, '/');
	}
};

export const actions = {
	createEntry: async ({ request }) => {
		// parse form data
		const data = await request.formData();
		const pool = Number(data.get('pool') as string);
		const teamName = data.get('team_name') as string;
		const name = data.get('name') as string;
		const picks = getPicks(data);

		// validate data
		if (!pool) return fail(400, { name, missing: true });
		if (!teamName) return fail(400, { teamName, missing: true });

		try {
			createEntry(pool, {
				name,
				teamName,
				picks,
				paid: false
			});
		} catch (err) {
			return fail(500, { error: err });
		}

		// all is gucci, redirect to pool page
		redirect(303, `/${pool}`);
	}
} satisfies Actions;
