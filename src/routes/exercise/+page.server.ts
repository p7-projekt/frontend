import type { PageServerLoad, Actions } from './$types';
import { setError, superValidate } from 'sveltekit-superforms';
import { fail, redirect } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';
import { fetchExerciseData } from '$lib/requestHandler';


const backendUrl = import.meta.env.VITE_BACKEND_URL;
const api_version = import.meta.env.VITE_V1;

export const load: PageServerLoad = async ({ cookies, url }) => {
	const access_token: string = cookies.get('access_token') || '';
	const refresh_token: string = cookies.get('refresh_token') || '';
	const exerciseId = url.searchParams.get('id') || 'XXX';

	const response = await fetch(`${backendUrl}${api_version}/exercises/${exerciseId}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${access_token}`	
	}});

	const responseBody = await response.text();
	const jsonResponse = JSON.parse(responseBody)
	delete jsonResponse.solution;
	console.log(jsonResponse)
	
	return {
		form: await superValidate(zod(formSchema)), exerciseData: jsonResponse
	};
};




export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		// Log the form data
		console.log('Form Data:', form.data); 
	}
};