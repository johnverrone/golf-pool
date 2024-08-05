<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Switch } from '$lib/components/ui/switch';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Select from '$lib/components/ui/select';
	import * as Table from '$lib/components/ui/table';

	let { data } = $props();
	let open = $state(false);
	let showPicks = $state(true);
	let view = $state<'pool' | 'tournament'>('pool');

	let pickColumns = $derived([
		...Array(Math.max(0, ...data.entries.map((e) => e.picks?.length ?? 0))).keys()
	]);

	let scoreLookup = $derived(
		data.leaderboard?.players.reduce<Map<string, number>>((acc, curr) => {
			return acc.set(curr.name, curr.score);
		}, new Map())
	);

	function getScore(picks: string[] | null): number {
		if (!picks) return 0;
		let score = 0;
		for (const p of picks) {
			const pickScore = scoreLookup?.get(p) ?? 0;
			score += pickScore;
		}
		return score;
	}
</script>

<Button href="/" variant="outline">back</Button>
<div class="my-6">
	<h1>{data.name}</h1>
	<p class="text-muted-foreground">{data.entries.length} entries in this pool</p>
</div>

<div>
	<Button onclick={() => (view = 'pool')}>Pool Leaderboard</Button>
	<Button onclick={() => (view = 'tournament')}>Tournament Leaderboard</Button>
</div>

{#if view === 'pool'}
	<div class="my-6 rounded-lg border p-8">
		<div class="flex justify-between">
			<h3 class="mb-4">Leaderboard</h3>
			<div class="flex items-center space-x-2">
				<Switch id="show-picks" bind:checked={showPicks} />
				<Label for="show-picks">Show picks</Label>
			</div>
		</div>
		<Table.Root class="table-fixed">
			<Table.Header>
				<Table.Row>
					<Table.Head>Team Name</Table.Head>
					<Table.Head>Name</Table.Head>
					{#if pickColumns.length}
						{#each pickColumns as column}
							<Table.Head>Pick {column + 1}</Table.Head>
						{/each}
					{/if}
					<Table.Head>Score</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.entries as entry}
					<Table.Row>
						<Table.Cell class="font-medium">{entry.teamName}</Table.Cell>
						<Table.Cell>{entry.name}</Table.Cell>
						{#if entry.picks}
							{#each entry.picks as pick}
								<Table.Cell>
									{showPicks ? `${pick} (${scoreLookup?.get(pick)})` : `~~~~~~`}
								</Table.Cell>
							{/each}
						{/if}
						<Table.Cell>{showPicks ? getScore(entry.picks) : `~~~~~~`}</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
		<div class="my-6">
			<Button variant="outline" onclick={() => (open = true)}>Add Entry</Button>
		</div>
	</div>
{:else if view === 'tournament' && data.leaderboard}
	<div class="my-6 rounded-lg border p-8">
		<h3 class="mb-4">{data.leaderboard.name}</h3>

		<Table.Root class="table-fixed">
			<Table.Header>
				<Table.Row>
					<Table.Head>Player</Table.Head>
					<Table.Head>Score</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.leaderboard.players as player}
					<Table.Row>
						<Table.Cell class="font-medium">{player.name}</Table.Cell>
						<Table.Cell>{player.displayScore}</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
{/if}

<Dialog.Root bind:open>
	<Dialog.Trigger />

	<Dialog.Content id="new-entry-modal">
		<Dialog.Header>
			<Dialog.Title>New Entry</Dialog.Title>
			<Dialog.Description>
				Make your picks. You can make changes until the first tee time.
			</Dialog.Description>
		</Dialog.Header>
		<form
			method="POST"
			action="?/createEntry"
			use:enhance={() => {
				return async ({ update }) => {
					open = false;
					update();
				};
			}}
		>
			<input name="pool" value={data.id} type="hidden" />
			<div class="grid gap-4 py-4">
				<div class="grid grid-cols-4 items-center gap-4">
					<label for="team_name" class="text-right">Team Name</label>
					<Input id="team_name" name="team_name" class="col-span-3" type="text" required />
				</div>
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="name" class="text-right">Name</Label>
					<Input id="name" name="name" class="col-span-3" type="text" required />
				</div>
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="email" class="text-right">Email</Label>
					<Input id="email" name="email" class="col-span-3" type="email" required />
				</div>
				{#if data.tiers}
					{#each [...data.tiers] as [tierNum, tier]}
						<div class="grid grid-cols-4 items-center gap-4">
							<Label for={`tier-${tierNum}-players`} class="text-right">Tier {tierNum}</Label>
							<Select.Root multiple={tier.required > 1}>
								<Select.Trigger class="col-span-3">
									<Select.Value
										placeholder={tier.required > 1 ? 'Select players' : 'Select a player'}
									/>
								</Select.Trigger>
								<Select.Content>
									<Select.Group>
										<Select.Label>Players</Select.Label>
										{#each tier.players as player}
											<Select.Item value={player} label={player}>{player}</Select.Item>
										{/each}
									</Select.Group>
								</Select.Content>
								<Select.Input name={`tier-${tierNum}-players`} />
							</Select.Root>
						</div>
					{/each}
				{/if}
			</div>
			<Dialog.Footer>
				<Button variant="outline" onclick={() => (open = false)}>Cancel</Button>
				<Button type="submit">Save changes</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
