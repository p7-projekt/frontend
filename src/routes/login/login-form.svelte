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

	const { form: formData, enhance, errors } = form;
</script>

<form method="POST" use:enhance>
	<!-- Email Field -->
	<Form.Field {form} name="email">
		<Form.Control let:attrs>
			<Form.Label>Email</Form.Label>
			<Input {...attrs} bind:value={$formData.email} />
		</Form.Control>
		<Form.Description>Please enter your email address.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<!-- Password Field -->
	<Form.Field {form} name="password">
		<Form.Control let:attrs>
			<Form.Label>Password</Form.Label>
			<Input type="password" {...attrs} bind:value={$formData.password} />
		</Form.Control>
		<Form.Description>Enter your password to log in.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	{#if $errors.email}<span class="invalid">{$errors.email}</span>{/if}
	<Form.Button>Login</Form.Button>
</form>
