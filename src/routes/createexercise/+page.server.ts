import type { PageServerLoad, Actions } from './$types.js';
import { fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';
import { handleAuthenticatedRequest } from '$lib/requestHandler';
import { convertFormData } from './helpers';
import { debugCreateExercise } from '$lib/debug.js';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const apiVersion = import.meta.env.VITE_API_VERSION_V1;

export const load: PageServerLoad = async ({ url, cookies }) => {
	const access_token = cookies.get('access_token') || '';
	const exerciseId = url.searchParams.get('exerciseid');

	let form = await superValidate(zod(formSchema));
	let exerciseData = null;

	debugCreateExercise('loading');

	if (exerciseId) {
		const response = await fetch(`${backendUrl}/${apiVersion}/exercises/${exerciseId}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${access_token}`
			}
		});

		const responseBody = await response.text();
		if (responseBody) {
			try {
				exerciseData = JSON.parse(responseBody);
				// Populate form with exercise data
				form.data.title = exerciseData.title;
				form.data.description = exerciseData.description;
				form.data.codeText = exerciseData.solution || '';
				form.data.testCases = exerciseData.testCases.map((testCase) => ({
					parameters: {
						input: testCase.inputParams.map((value, index) => ({
							type: exerciseData.inputParameterType[index],
							value
						})),
						output: testCase.outputParams.map((value, index) => ({
							type: exerciseData.outputParamaterType[index],
							value
						}))
					},
					publicVisible: testCase.publicVisible
				}));
			} catch (error) {
				debugCreateExercise('Failed to parse JSON response:', error);
				throw new Error('Failed to parse JSON response');
			}
		}
	}

	return {
		form,
		exerciseData
	};
};

async function postExercise(
	backendUrl: string,
	api_version: string,
	access_token: string,
	apiData
): Promise<Response> {
	return await fetch(`${backendUrl}/${api_version}/exercises`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${access_token}` // Append the Bearer token
		},
		body: JSON.stringify(apiData)
	});
}

async function updateExercise(
	backendUrl: string,
	api_version: string,
	access_token: string,
	exerciseId: string,
	apiData
): Promise<Response> {
	return await fetch(`${backendUrl}/${api_version}/exercises/${exerciseId}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${access_token}` // Append the Bearer token
		},
		body: JSON.stringify(apiData)
	});
}

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		// Convert form data to API format
		const apiData = convertFormData(form.data);
		const access_token = event.cookies.get('access_token');
		const refresh_token = event.cookies.get('refresh_token');
		const exerciseId = event.url.searchParams.get('exerciseid');
		const isEditMode = event.url.searchParams.get('edit') === 'true';

		let response;
		if (isEditMode && exerciseId) {
			response = await handleAuthenticatedRequest(
				(token) => updateExercise(backendUrl, apiVersion, token, exerciseId, apiData),
				access_token,
				refresh_token,
				event.cookies
			);
		} else {
			response = await handleAuthenticatedRequest(
				(token) => postExercise(backendUrl, apiVersion, token, apiData),
				access_token,
				refresh_token,
				event.cookies
			);
		}

		if (response.ok) {
			const responseBody = await response.text(); // Read the response as text
			let resJSON;
			if (responseBody) {
				try {
					resJSON = JSON.parse(responseBody); // Try to parse the response as JSON
				} catch (e) {
					debugCreateExercise('Failed to parse response JSON:', e);
					resJSON = { detail: responseBody }; // If parsing fails, use the text as the response detail
				}
			} else {
				resJSON = { detail: 'No response body' }; // Handle empty response body
			}

			if (resJSON.isFailed) {
				const errorMessages = resJSON;
				debugCreateExercise('Create exercise failed:', errorMessages);
				return setError(form, 'codeText', errorMessages || 'An error occurred on the server');
			} else {
				debugCreateExercise('Successfull post:', resJSON);
				throw redirect(303, '/');
			}
		} else {
			const responseBody = await response.text(); // Read the response as text
			debugCreateExercise('responseBody:', responseBody);
			let error;
			if (responseBody) {
				try {
					const resJSON = JSON.parse(responseBody); // Try to parse the response as JSON
					if (resJSON.errors) {
						const errorMessages = Object.values(resJSON.errors).flat().join('\n'); // Flatten and join all error messages
						return setError(form, 'codeText', errorMessages || 'An error occurred on the server');
					} else {
						error = { detail: responseBody }; // If no errors field, use the text as the error detail
					}
				} catch (e) {
					error = { detail: responseBody }; // If parsing fails, use the text as the error detail
				}
			} else {
				error = { detail: 'An unknown error occurred' }; // Handle empty response body
			}

			return setError(form, 'codeText', error.detail || 'An error occurred on the server');
		}
	}
};
