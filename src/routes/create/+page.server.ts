import { fail, redirect, type Actions } from '@sveltejs/kit';
import { getTierInfo } from './create';
import { createPool } from '$lib/api/pools';

export const actions = {
	createPool: async ({ request }) => {
		// parse form data
		const data = await request.formData();
		const name = data.get('name') as string;
		const tiers = getTierInfo(data);

		// validate data
		if (!name) return fail(400, { name, missing: true });
		if (tiers.size < 1) return fail(400, { tiers, missing: true });

		try {
			createPool({
				name,
				tiers
			});
		} catch (err) {
			return fail(500, { error: err });
		}

		// all is gucci, redirect home
		redirect(303, '/');
	}
} satisfies Actions;
