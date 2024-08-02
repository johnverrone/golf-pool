import { supabase } from '$lib/supabaseClient';

export async function load() {
	const { data } = await supabase.from('pools').select();
	return {
		title: 'Golf Pools',
		pools: data ?? []
	};
}
