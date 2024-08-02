import { supabase } from '$lib/supabaseClient';

// TYPES

export type Tier = {
	players: string[];
	required: number;
};

export type Entry = {
	name: string;
	teamName: string;
	paid: boolean;
	picks: string[] | null;
};

export type Pool = {
	id: number;
	name: string;
	tiers: Map<number, Tier>;
};

export type PoolWithEntries = Pool & {
	entries: Entry[];
};

// API

/**
 * Create a new pool
 */
export async function createPool(pool: Pool): Promise<true> {
	// first insert the pool row
	const poolData = [{ name: pool.name }];
	const poolsQuery = await supabase.from('pools').insert(poolData).select().limit(1);
	const pool_id = poolsQuery.data?.at(0)?.id;
	if (poolsQuery.error || !pool_id) {
		console.error(poolsQuery.error);
		throw new Error('failed inserting pool row');
	}

	// insert tiers
	const tierData = Object.entries(pool.tiers).map(([num, t]) => ({
		pool_id,
		tier_num: Number(num),
		required_picks: t.required,
		players: t.players
	}));
	const { error: tiersError } = await supabase.from('tiers').insert(tierData);
	if (tiersError) {
		console.error(tiersError);
		throw new Error('failed inserting tier rows');
	}

	return true;
}

/**
 * Get a pool by id
 */
export async function getPoolById(id: string): Promise<PoolWithEntries> {
	const poolsQuery = await supabase.from('pools').select().eq('id', id).limit(1).single();
	const entriesQuery = await supabase.from('entries').select().eq('pool_id', id);
	const tiersQuery = await supabase.from('tiers').select().eq('pool_id', id);

	if (poolsQuery.error || entriesQuery.error || tiersQuery.error) {
		throw new Error('failed to fetch pool info');
	}

	return {
		...poolsQuery.data,
		entries: entriesQuery.data.map((d) => ({
			name: d.name ?? '',
			teamName: d.team_name,
			paid: d.paid,
			picks: d.players
		})),
		tiers: new Map(
			tiersQuery.data.map((d) => [
				d.tier_num,
				{ players: d.players ?? [], required: d.required_picks }
			])
		)
	};
}

/**
 * Create a pool entry
 */
export async function createEntry(poolId: Pool['id'], entry: Entry): Promise<true> {
	const entryData = [
		{
			pool_id: poolId,
			team_name: entry.teamName,
			name: entry.name,
			paid: entry.paid,
			players: entry.picks
		}
	];
	const entriesQuery = await supabase.from('entries').insert(entryData);
	if (entriesQuery.error) {
		console.error(entriesQuery.error);
		throw new Error('failed inserting entry');
	}

	return true;
}
