<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Select from '$lib/components/ui/select';

	let { data } = $props();
	let open = $state(false);
</script>

<Button href="/" variant="outline">back</Button>
<div class="my-6">
	<h1>{data.name}</h1>
	<p class="text-muted-foreground">{data.entries.length} entries in this pool</p>
</div>

<div class="my-6">
	<h3>Entries</h3>
	<ul>
		{#each data.entries as entry}
			<li class="my-4">{entry.teamName} - ({entry.name}) [{entry.picks?.length ?? 0}]</li>
		{/each}
	</ul>
</div>

<Button variant="outline" onclick={() => (open = true)}>Add Entry</Button>
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
							<Select.Root multiple={tier.required > 1} portal={null}>
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
