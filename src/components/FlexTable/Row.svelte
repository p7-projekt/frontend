<script lang="ts">
	export let nr_cols = 4;
</script>

<header class="grid grid-cols-{nr_cols} hover:bg-muted/50 rounded-md">
	<slot />
</header>
