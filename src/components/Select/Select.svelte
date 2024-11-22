<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import { createEventDispatcher } from 'svelte';

	export let select_title = '';
	export let select_options: string[] = [];
	export let post_option_str = '';
	export let multiple = false;

	let multiple_selected: string[] = [];

	$: multiple_selected;

	const dispatch = createEventDispatcher();

	function updateSelected(option: string) {
		// Toggle the option in multiple_selected
		if (multiple_selected.includes(option)) {
			// Remove the option if it's already selected
			multiple_selected = multiple_selected.filter((item) => item !== option);
		} else {
			// Add the option if it's not selected
			multiple_selected = [...multiple_selected, option];
		}

		// Dispatch an event with the updated selected options
		dispatch('message', { chosen_options: multiple_selected });
	}

	function sendToParent(option: string) {
		dispatch('message', { chosen_option: option });
	}
</script>

<Select.Root {multiple}>
	<Select.Trigger class="w-[180px]">
		<Select.Value placeholder={select_title} />
	</Select.Trigger>
	<Select.Content>
		{#each select_options as option}
			<Select.Item
				value={option}
				on:click={() => {
					if (multiple) updateSelected(option);
					else sendToParent(option);
				}}>{option} {post_option_str}</Select.Item
			>
		{/each}
	</Select.Content>
</Select.Root>
