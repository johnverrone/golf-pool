<script lang="ts">
	import { enhance } from '$app/forms';

	let { data } = $props();

	let dialog = $state<HTMLDialogElement>();

	function open() {
		dialog?.showModal();
	}

	function close() {
		dialog?.close();
	}
</script>

<div>
	<a href="/">back</a>
</div>
<h2>{data.name} {data.id}</h2>

<button onclick={open}>Add Entry</button>
<dialog id="new-entry-modal" bind:this={dialog}>
	<h3>New Entry</h3>
	<form
		method="POST"
		action="?/createEntry"
		use:enhance={() => {
			return async ({ update }) => {
				close();
				update();
			};
		}}
	>
		<input name="pool" value={data.id} type="hidden" />
		<div>
			<label for="team_name">Team Name</label>
			<input id="team_name" name="team_name" type="text" required />
		</div>
		<div>
			<label for="email">Email</label>
			<input id="email" name="email" type="email" required />
		</div>
		<div>
			<label for="name">Name</label>
			<input id="name" name="name" type="text" required />
		</div>
		{#if data.tiers}
			{#each [...data.tiers] as [tierNum, tier]}
				<div>
					<label for={`tier-${tierNum}-players`}>Tier {tierNum}</label>
					<select
						id={`tier-${tierNum}-players`}
						name={`tier-${tierNum}-players`}
						multiple={tier.required > 1}
					>
						<option value="">Select an option</option>
						{#if tier.players}
							{#each tier.players as player}
								<option value={player}>{player}</option>
							{/each}
						{/if}
					</select>
				</div>
			{/each}
		{/if}
		<div>
			<button type="submit">Submit</button>
			<button type="button" onclick={close}>Cancel</button>
		</div>
	</form>
</dialog>

<h2>Entries</h2>
<ul>
	{#each data.entries as entry}
		<li>{entry.teamName} - ({entry.name}) [{entry.picks?.length ?? 0}]</li>
	{/each}
</ul>
