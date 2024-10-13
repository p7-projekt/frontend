<script lang="ts">
	export let list_title = '';
	export let list: [App.ExerciseItem];

	console.log(list);
</script>

<div class="flex w-full flex-col w-full overflow-hidden rounded-lg border-[1.5px]">
	<div class="table-header pl-1">
		<div class="flex items-center h-12 font-medium">
			{list_title} Exercises
		</div>
	</div>
	<div class="text-sm font-medium">
		{#if list}
			{#each list as list_item}
				<div
					class="pl-1 pr-1 w-[675px] h-[52px] border-b-[1.5px] flex items-center hover-effect w-full justify-between"
				>
					<slot name="before-item"></slot>
					<p class="inline-block">{list_item.title}</p>
					<slot name="after-item"></slot>
					<!-- <svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="#1f2937"
						class="size-6 cursor-pointer"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
					</svg> -->
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
