<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import TestCase from './TestCase.svelte';

	export let testCasesStore;
	export let isEditMode: boolean = false;
	export let existingTestCase = null;
	export let open: boolean = false;
	export let testCaseTemplate;

	function handleCancel() {
		open = false;
	}

	function handleFinish() {
		open = false;
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>{isEditMode ? 'Edit Test Case' : 'Create Test Case'}</Dialog.Title>
		</Dialog.Header>
		<TestCase
			{isEditMode}
			{existingTestCase}
			on:cancel={handleCancel}
			on:finishCreatingOrUpdating={handleFinish}
			{testCasesStore}
			{testCaseTemplate}
		/>
	</Dialog.Content>
</Dialog.Root>
