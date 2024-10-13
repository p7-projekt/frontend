<script lang="ts">
	export let list_title = '';
	export let list: string[];
</script>

<div class="flex w-full flex-col w-full overflow-hidden rounded-lg border-[1.5px]">
	<div class="table-header pl-1">
		<div class="flex items-center h-12 font-medium">
			{list_title} Exercises
		</div>
	</div>
	<div class="text-sm font-medium">
		{#if list.length !== 0}
			{#each list as list_item}
				<div
					class="pl-1 pr-1 w-[675px] h-[52px] border-b-[1.5px] flex items-center hover-effect w-full justify-between"
				>
					<slot name="before-item"></slot>
					<p class="inline-block">{list_item}</p>
					<slot name="after-item"></slot>
				</div>
			{/each}
		{/if}
	</div>
</div>

<style>
	.table-header {
		background-color: #0000000d;
	}
	.hover-effect {
		overflow: hidden;
	}
	.hover-effect:hover,
	.hover-effect:active {
		background-color: #0000000d;
	}
</style>
