<script lang="ts">
	export let title_name = '';
	export let exercise_list;
	console.log(exercise_list);
</script>

<div class="flex w-full flex-col w-full overflow-hidden rounded-lg border-[1.5px]">
	<div class="table-header pl-1">
		<div class="flex items-center h-12 font-medium">
			{title_name} Exercises
		</div>
	</div>
	<div class="text-sm font-medium">
		{#each exercise_list.exercises as exercise}
			<div
				class="pl-1 pr-1 w-[675px] h-[52px] border-b-[1.5px] flex items-center hover-effect w-full justify-between"
			>
				<p class="inline-block">{exercise.title}</p>
				<svg
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
					/>
				</svg>
			</div>
		{/each}

		<!-- <div class="pl-1 w-[675px] h-[52px] border-b-[1.5px] flex items-center hover-effect">
			Add two numbers
		</div>
		<div class="pl-1 w-[675px] h-[52px] border-b-[1.5px] flex items-center hover-effect">
			Counter
		</div>
		<div class="pl-1 w-[675px] h-[52px] border-b-[1.5px] flex items-center hover-effect">
			Counter 2
		</div> -->
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
