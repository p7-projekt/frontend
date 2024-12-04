<script lang="ts">
	import { goto } from '$app/navigation';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { formSchema, type FormSchema } from './sign-up-schema'; // Import your signup schema
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { onMount } from 'svelte';

	export let data: SuperValidated<Infer<FormSchema>>;
	let signupSuccess = false;

	const form = superForm(data, {
		validators: zodClient(formSchema),
		onResult: ({ result }) => {
			if (result.status === 204) {
				signupSuccess = true;
			}
		}
	});

	const { form: formData, enhance, errors } = form;
	$: signupSuccess = signupSuccess;
</script>

<div class="flex min-h-screen items-start pt-16 justify-center bg-gray-100">
	<!-- Outer wrapper to center both the title and form together -->
	<div class="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
		<!-- Application Title -->
		<h1 class="text-2xl font-bold text-center mb-6">Sign up for SyntaxShift!</h1>
		{#if !signupSuccess}
			<!-- Form -->
			<form method="POST" action="?/signUp" use:enhance>
				<!-- Email Field -->
				<Form.Field {form} name="name">
					<Form.Control let:attrs>
						<Form.Label class="!text-current">Name</Form.Label>
						<Input placeholder="Enter your name" {...attrs} bind:value={$formData.name} />
					</Form.Control>
					<Form.FieldErrors />
					<br />
				</Form.Field>

				<!-- Email Field -->
				<Form.Field {form} name="email">
					<Form.Control let:attrs>
						<Form.Label class="!text-current">Email</Form.Label>
						<Input
							placeholder="Enter your email address."
							{...attrs}
							bind:value={$formData.email}
						/>
					</Form.Control>
					<Form.FieldErrors />
					<br />
				</Form.Field>

				<!-- Password Field -->
				<Form.Field {form} name="password">
					<Form.Control let:attrs>
						<Form.Label class="!text-current">Password</Form.Label>
						<Input
							placeholder="Enter a password."
							type="password"
							{...attrs}
							bind:value={$formData.password}
						/>
					</Form.Control>
					<Form.FieldErrors />
					<br />
				</Form.Field>

				<!-- Confirm Password Field -->
				<Form.Field {form} name="confirmPassword">
					<Form.Control let:attrs>
						<Form.Label class="!text-current">Confirm Password</Form.Label>
						<Input
							placeholder="Re-enter your password"
							type="password"
							{...attrs}
							bind:value={$formData.confirmPassword}
						/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<!-- Submit Button -->
				<Form.Button class="w-full mt-4">Sign Up</Form.Button>
			</form>
		{:else}
			<!-- Signup Success Message -->
			<div class="text-center">
				<h1 class="text-2xl font-bold text-green-600">Sign-up Successful!</h1>
				<p class="mt-4">
					Thank you for signing up! You can now <a href="/login" class="text-blue-500 underline"
						>log in</a
					> to your account.
				</p>
			</div>
		{/if}
	</div>
</div>
