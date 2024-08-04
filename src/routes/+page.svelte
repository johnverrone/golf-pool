<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	let { data } = $props();
</script>

<div>
	<h1>Pools</h1>
	<p class="text-muted-foreground">Manage your golf pools.</p>
</div>

<ul class="my-6 flex flex-col space-y-1">
	{#if data.pools}
		{#each data.pools as pool}
			<li><Button href={`/${pool.id}`} variant="ghost">{pool.name}</Button></li>
		{/each}
	{/if}
</ul>

<Button href="/create">Create</Button>
