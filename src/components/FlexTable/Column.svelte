<script>
	import { slide } from 'svelte/transition';
</script>

<div
	class="flex items-center justify-center h-12 px-4 font-medium border-b hover:bg-muted/50"
	out:slide
>
	<slot />
</div>
