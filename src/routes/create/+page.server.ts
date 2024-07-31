import { supabase } from '$lib/supabaseClient';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { getTierInfo } from './create';

export const actions = {
	createPool: async ({ request }) => {
		// parse form data
		const data = await request.formData();
		const name = data.get('name');
		const tierArray = getTierInfo(data);

		// validate data
		if (!name) return fail(400, { name, missing: true });

		// insert pool
		const poolData = [{ name: name.toString() }];
		const poolsQuery = await supabase.from('pools').insert(poolData).select().limit(1);
		const pool_id = poolsQuery.data?.at(0)?.id;
		if (poolsQuery.error || !pool_id) {
			console.error(poolsQuery.error);
			return fail(500, { error: poolsQuery.error, success: false });
		}

		// insert tiers
		const tierData = tierArray.map((t) => ({ ...t, pool_id }));
		const { error: tiersError } = await supabase.from('tiers').insert(tierData);
		if (tiersError) {
			console.error(tiersError);
			return fail(500, { error: tiersError, success: false });
		}

		// all is gucci, redirect home
		redirect(303, '/');
	}
} satisfies Actions;
