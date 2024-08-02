<script lang="ts">
	let { data } = $props();
</script>

<h2>Pools</h2>
<ul>
	{#each data.pools as pool}
		<li><a href={`/${pool.id}`}>{pool.name}</a></li>
	{/each}
</ul>
<a href="/create">create pool</a>
