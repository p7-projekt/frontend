<script lang="ts">
	import ListBox from '$components/Lists/ListBox.svelte';

	export let exercise_lists;
	let added_exercise_list: [App.ExerciseItem];
	let unadded_exercise_list = exercise_lists.instructor_exercise_list;
</script>

<div class="flex">
	<div class="w-2/5 mr-8">
		<ListBox list_title="Added" list={added_exercise_list}>
			<svg
				slot="after-item"
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
		</ListBox>
	</div>
	<div class="w-2/5">
		<ListBox list_title="Instructor" list={unadded_exercise_list}>
			<svg
				slot="before-item"
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
					d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
				/>
			</svg>
		</ListBox>
	</div>
</div>
