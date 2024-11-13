<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import type { ActionData } from '../$types';

	let code: string = '';
	export let form: ActionData;
</script>

<div class="flex min-h-screen items-start pt-32 justify-center bg-gray-100">
	<form class="flex flex-col items-center text-center max-w-md w-full p-8 bg-white shadow-md rounded-lg" method="POST" action="?/join" use:enhance>
		<p class="text-xl font-semibold text-gray-700 mb-4">Enter your code below to join!</p>
		<Input
			class="mb-8 w-full"
			name="sessionCode"
			placeholder="Enter code"
			bind:value={code}
			required
			autocomplete="off"
		/>
		
		<!-- Error Message -->
		{#if form?.error}
			<p class="text-red-600 text-sm mt-2">{form.error}</p>
		{/if}
		
		<!-- Submit Button -->
		<Button class="w-full mt-2 max-w-xs py-3" type="submit" size="lg">Join</Button>
	</form>
</div>
