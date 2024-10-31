<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import { createEventDispatcher } from 'svelte';

	export let select_title = '';
	export let select_options: string[] = [];

	const dispatch = createEventDispatcher();

	function sendToParent(option: string) {
		dispatch('message', { chosen_option: option });
	}
</script>

<Select.Root>
	<Select.Trigger class="w-[180px]">
		<Select.Value placeholder={select_title} />
	</Select.Trigger>
	<Select.Content>
		{#each select_options as option}
			<Select.Item value={option} on:click={() => sendToParent(option)}>{option}</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>
