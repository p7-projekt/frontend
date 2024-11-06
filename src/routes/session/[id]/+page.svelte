<script lang="ts">
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import FlexTable from '$components/FlexTable/index';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	export let data: PageData;
	const session: {
		title: string;
		description: string;
		author: string;
		sessionExpiresUtc: string;
		exercises: { id: number; name: string; solved: boolean };
	} = data.session;

	let sessionId: string;
	onMount(() => {
		const url = new URL(window.location.href);
		const pathSegments = url.pathname.split('/');
		sessionId = pathSegments[pathSegments.length - 1];
	});
</script>

<div class="container grid grid-cols-1 gap-y-8 pl-6 w-full text-[#333] mt-3">
	<h1 class=" text-3xl font-semibold col-span-full">{session.title}</h1>

	<div class="w-3/4">
		<h2 class="text-2xl font-semibold col-span-full mb-3">Description</h2>
		<p>
			{session.description}
		</p>
	</div>
	<section class="w-3/4">
		<h2 class="text-2xl font-semibold col-span-full mb-3">Exercises</h2>
		<div class=" border-[1.5px]">
			<FlexTable>
				<FlexTable.Header nr_cols={3}>
					<FlexTable.Column>Title</FlexTable.Column>
					<FlexTable.Column>Completed</FlexTable.Column>
					<FlexTable.Column />
				</FlexTable.Header>
				<FlexTable.Body nr_cols={3}>
					{#each session.exercises as exercise (exercise.id)}
						<FlexTable.Column>{exercise.name}</FlexTable.Column>
						<FlexTable.Column>
							<Checkbox
								checked={exercise.solved}
								disabled
								style="cursor: default !important; opacity: 1;"
							/>
						</FlexTable.Column>
						<FlexTable.Column>
							<button
								on:click={() => goto(`/exercise?exerciseid=${exercise.id}&seshid=${sessionId}`)}
								class="text-[1.125rem] px-4 py-2 text-sm rounded-sm font-bold text-white border-2 border-[#1f2937] bg-[#1f2937] hover:bg-transparent hover:text-[#1f2937]"
							>
								Code
							</button>
						</FlexTable.Column>
					{/each}
				</FlexTable.Body>
			</FlexTable>
		</div>
	</section>
</div>

<style>
</style>
