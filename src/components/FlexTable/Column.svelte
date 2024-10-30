<script>
	import { slide } from 'svelte/transition';
</script>

<div class="flex items-center justify-center h-12 px-4 font-medium" out:slide>
	<slot />
</div>
