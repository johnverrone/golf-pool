<script lang="ts">
	import type { HTMLTableAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils.js';

	type $$Props = HTMLTableAttributes;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<div class="relative overflow-auto">
	<table class={cn('min-w-full caption-bottom text-sm', className)} {...$$restProps}>
		<slot />
	</table>
</div>
