<script lang="ts">
	export let nr_cols = 4;
	export let cssClass = '';
</script>

<div class="grid grid-cols-{nr_cols} rounded-md {cssClass}">
	<slot />
</div>
