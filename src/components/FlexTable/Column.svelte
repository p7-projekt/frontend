<script lang="ts">
	export let cssClass = '';
</script>

<div class="flex items-center h-12 px-4 font-medium {cssClass}">
	<slot />
</div>
