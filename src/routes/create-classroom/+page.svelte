<script lang="ts">
	import TitleInput from '$components/Input/TitleInput.svelte';
	import { enhance } from '$app/forms';
	import DescriptionBox from '$components/Textarea/DescriptionBox.svelte';
	import type { ActionData, PageData } from './$types';

	export let form: ActionData;
</script>

<form method="post" use:enhance>
	<div class="container grid grid-cols-1 gap-6 pl-6 w-full text-[#333] mt-3 ml-[16rem]">
		<div></div>
		<div class="flex justify-end cursor-pointer">
			<a href="/">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-6"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
				</svg>
			</a>
		</div>
		<h1 class=" text-2xl font-medium">Create Classroom</h1>

		<div class="w-1/4">
			<TitleInput input_name="classroom-title" />
			{#if form?.errors}
				<p style="color:red; margin-bottom:0;">{form?.errors[0].message}</p>
			{/if}
		</div>

		<DescriptionBox customClass="w-3/4 h-[16rem]" description_name="classroom-description" />

		<div class="flex justify-end w-3/4">
			<button
				type="submit"
				class="text-[18px] w-20 px-4 py-2 text-sm rounded-sm font-bold text-white border-2 border-[#1f2937] bg-[#1f2937] transition-all ease-in-out duration-300 hover:bg-transparent hover:text-[#1f2937]"
			>
				Submit
			</button>
		</div>
	</div>
</form>
