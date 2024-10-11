<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';

	export let text = 'default';
</script>

<Button variant="secondary">{text}</Button>
