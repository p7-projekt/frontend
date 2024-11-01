<script lang="ts">
	export let nr_cols = 4;
</script>

<header class="border-b grid grid-cols-{nr_cols} hover:bg-muted/50 text-muted-foreground">
	<slot />
</header>
