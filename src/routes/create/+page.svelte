<script lang="ts">
	import { enhance } from '$app/forms';

	let tierCount = $state(1);
	let tiers = $derived([...Array(tierCount)].map((_, i) => i + 1));
</script>

<div>
	<a href="/">back</a>
</div>

<h2>Create New Pool</h2>

<form method="POST" action="?/createPool" use:enhance>
	<div>
		<label for="name">Name</label>
		<input id="name" type="text" name="name" required />
	</div>
	<div>
		<label for="rules">Rules</label>
		<textarea id="rules" name="rules" rows="10" cols="40"></textarea>
	</div>
	<div>
		<span>Enter one golfer per line</span>
	</div>
	{#each tiers as tier}
		<div>
			<p>Tier {tier}</p>
			<label for={`tier-${tier}-players`}>Players</label>
			<textarea
				id={`tier-${tier}-players`}
				name={`tier-${tier}-players`}
				rows={Math.min(5 * tier, 40)}
				cols="40"
			></textarea>
			<label for={`tier-${tier}-required`}># Required</label>
			<input type="number" name={`tier-${tier}-required`} required />
		</div>
	{/each}
	<div>
		<button type="button" onclick={() => tierCount++}>Add tier</button>
	</div>
	<div>
		<button>Create Pool</button>
	</div>
</form>

<style lang="scss">
	form {
		display: flex;
		flex-flow: column;
		gap: 8px;

		textarea {
			resize: vertical;
		}
	}
</style>
