import { supabase } from '$lib/supabaseClient';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const poolsQuery = await supabase.from('pools').select().eq('id', params.id).limit(1).single();
	const entriesQuery = await supabase.from('entries').select().eq('pool', params.id);
	const tiersQuery = await supabase.from('tiers').select().eq('pool_id', params.id);

	if (poolsQuery.error || entriesQuery.error) {
		redirect(307, '/');
	}

	return {
		...poolsQuery.data,
		entries: entriesQuery.data,
		tiers: tiersQuery.data
	};
};

export const actions = {
	createEntry: async ({ request }) => {
		const data = await request.formData();
		const pool = data.get('pool');
		const team_name = data.get('team_name');
		const name = data.get('name');
		if (!pool || !team_name || !name) return fail(400, { missing: true });
		const entryData = [
			{
				pool: parseInt(pool.toString(), 10),
				team_name: team_name.toString(),
				name: name.toString()
			}
		];
		const { error } = await supabase.from('entries').insert(entryData);
		if (error) {
			return fail(500, { error, success: false });
		}
		redirect(303, `/${pool}`);
	}
} satisfies Actions;
