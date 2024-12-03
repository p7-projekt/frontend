<script lang="ts">
	export let nr_cols = 4;
	export let cssClass = '';
</script>

<div class="grid grid-cols-{nr_cols} {cssClass} border-b border-gray-300 p-2">
	<slot />
</div>
