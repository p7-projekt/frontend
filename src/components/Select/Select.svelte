<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	export let select_title = '';
	export let select_options: { value: unknown; label: string }[] = [];
	export let post_option_str = '';

	export let values: { value: unknown; label: string }[] = [];
	export let multiple = false; // New prop to toggle between single and multiple select

	const dispatch = createEventDispatcher();

	let multiple_selected: { value: unknown; label: string }[] = values ? values : [];
	let isOpen = false;

	let dropdownContainer: HTMLElement | null = null; // Reference to the dropdown container

	// Toggle dropdown visibility
	function toggleDropdown() {
		isOpen = !isOpen;
	}

	// Select or deselect an option
	function toggleSelection(option) {
		if (multiple) {
			// Multiple selection logic
			if (
				multiple_selected.some((item) => item.value === option.value && item.label === option.label)
			) {
				multiple_selected = multiple_selected.filter(
					(item) => item.value !== option.value || item.label !== option.label
				);
			} else {
				multiple_selected = [...multiple_selected, option];
			}

			dispatch('message', { chosen_options: multiple_selected });
		} else {
			// Single selection logic
			multiple_selected = [option]; // Replace any previous selection
			isOpen = false; // Close dropdown after selecting
			dispatch('message', { chosen_option: multiple_selected[0] });
		}
	}

	// Handle clicks outside the dropdown
	function handleOutsideClick(event: MouseEvent) {
		if (dropdownContainer && !dropdownContainer.contains(event.target as Node)) {
			isOpen = false;
		}
	}

	// Add and clean up the outside click listener
	onMount(() => {
		document.addEventListener('click', handleOutsideClick);
		return () => {
			document.removeEventListener('click', handleOutsideClick);
		};
	});
</script>

<div class="relative w-64" bind:this={dropdownContainer}>
	<!-- Dropdown Button -->
	<button
		class="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-400 rounded-md shadow-sm hover:bg-gray-50 focus:ring focus:ring-indigo-500"
		type="button"
		on:click={toggleDropdown}
	>
		<span>
			{#if multiple_selected.length > 0}
				{#if multiple}
					{multiple_selected.map((option) => option.label).join(', ')}
				{:else}
					{multiple_selected[0]?.label}
				{/if}
			{:else}
				Select options
			{/if}
		</span>
		<span>&#9662;</span>
	</button>

	<!-- Dropdown Menu -->
	{#if isOpen}
		<div
			class="absolute left-0 z-10 w-full mt-2 bg-white border border-gray-200 rounded-md shadow-lg"
		>
			<ul class="py-1 text-sm text-gray-700">
				{#each select_options as option}
					<li>
						<button
							type="button"
							class={`px-4 py-2 hover:bg-gray-100 cursor-pointer w-full flex flex-start justify-between`}
							on:click={() => toggleSelection(option)}
						>
							{option.label}
							{#if multiple_selected.some((item) => item.value === option.value && item.label === option.label)}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="size-6"
								>
									<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
								</svg>
							{/if}
						</button>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>
