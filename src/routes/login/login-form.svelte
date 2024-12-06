<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { formSchema, type FormSchema } from './schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let data: SuperValidated<Infer<FormSchema>>;

	const form = superForm(data, {
		validators: zodClient(formSchema)
	});

	const { form: formData, enhance } = form;
</script>

<div class="flex min-h-screen items-start pt-16 justify-center bg-gray-100">
	<!-- Outer wrapper to center both the title and form together -->
	<div class="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
		<!-- Application Title -->
		<h1 class="text-2xl font-bold text-center mb-6">Sign in to SyntaxShift!</h1>

		<!-- Form -->
		<form method="POST" use:enhance>
			<!-- Email Field -->
			<Form.Field {form} name="email">
				<Form.Control let:attrs>
					<Form.Label class="!text-current">Email</Form.Label>
					<Input placeholder="Enter your email address." {...attrs} bind:value={$formData.email} />
				</Form.Control>
				<Form.FieldErrors />
				<br />
			</Form.Field>

			<!-- Password Field -->
			<Form.Field {form} name="password">
				<Form.Control let:attrs>
					<Form.Label class="!text-current">Password</Form.Label>
					<Input
						placeholder="Enter your password."
						type="password"
						{...attrs}
						bind:value={$formData.password}
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<!--{#if $errors.email}<span class="invalid">{$errors.email}</span>{/if}-->
			<Form.Button class="w-full mt-4">Login</Form.Button>
		</form>
	</div>
</div>
