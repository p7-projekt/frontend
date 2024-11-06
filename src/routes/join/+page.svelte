<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import type { ActionData } from '../$types';

	let code: string = '';
	export let form: ActionData;
</script>

<div class="customContainer">
	<form class="form-group" method="POST" action="?/join" use:enhance>
		<p class="form-text">Enter your code below to join!</p>
		<Input
			class="shad-input"
			name="sessionCode"
			placeholder="Enter code"
			bind:value={code}
			required
			autocomplete="off"
		/>
		{#if form?.error}
			<p class="error mt-2" style="color: red; font-size: small;">{form.error}</p>
		{/if}
		<Button class="submit-button mt-2" type="submit" size="lg">Join</Button>
	</form>
</div>

<style>
	.customContainer {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		background-color: #f2f2f2;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		max-width: 400px;
		width: 100%;
	}

	.shad-input {
		margin-bottom: 128px;
		width: 100%;
	}

	.form-text {
		font-size: x-large;
		margin-bottom: 12px;
		color: #333;
	}

	.submit-button {
		width: 100%;
		padding: 15px 25px;
		max-width: 300px;
	}
</style>
