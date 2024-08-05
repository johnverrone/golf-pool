<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';

	let tierCount = $state(1);
	let tiers = $derived([...Array(tierCount)].map((_, i) => i + 1));
</script>

<Button href="/" variant="outline">back</Button>
<div class="my-6">
	<h1>Create New Pool</h1>
</div>

<form method="POST" action="?/createPool" use:enhance>
	<div>
		<Label for="name">Name</Label>
		<Input id="name" type="text" name="name" required />
	</div>
	<div>
		<Label for="rules">Rules</Label>
		<Textarea id="rules" name="rules" />
	</div>
	{#each tiers as tier, idx}
		<div>
			<div class="grid grid-cols-4 gap-4">
				<div class="col-span-3">
					<Label for={`tier-${tier}-players`}>Tier {tier} Players</Label>
					<Textarea id={`tier-${tier}-players`} name={`tier-${tier}-players`} />
				</div>
				<div>
					<Label for={`tier-${tier}-required`}>No. Picks</Label>
					<Input type="number" name={`tier-${tier}-required`} value={1} required />
				</div>
			</div>
			{#if idx === 0}<p class="text-xs italic text-muted-foreground">One golfer per line</p>{/if}
		</div>
	{/each}
	<Button type="button" variant="outline" class="mt-2" onclick={() => tierCount++}>Add tier</Button>
	<Button type="submit">Create Pool</Button>
</form>

<style lang="scss">
	form {
		display: flex;
		flex-flow: column;
		gap: 16px;
	}
</style>
