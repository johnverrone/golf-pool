<script lang="ts">
	let { data } = $props();
</script>

<h1>{data.leaderboard.name}</h1>

<ul>
	{#each data.leaderboard.players as p}
		<li>{p.name} ({p.displayScore})</li>
	{/each}
</ul>
