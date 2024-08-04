import { getPools } from '$lib/api/pools';
import { fail } from '@sveltejs/kit';

export async function load() {
	try {
		const pools = await getPools();
		return {
			title: 'Golf Pools',
			pools
		};
	} catch (err) {
		console.error(err);
		fail(500);
	}
}
