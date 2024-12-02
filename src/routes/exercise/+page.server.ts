import type { PageServerLoad, Actions } from './$types';
import { setError, superValidate } from 'sveltekit-superforms';
import { fail, redirect } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';
import { setIDEBoilerPlate } from '$lib/boilerplate';
import { debugExercise } from '$lib/debug';
import { availableLanguages } from '$lib/availableLanguages';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const apiVersion = import.meta.env.VITE_API_VERSION_V1;
const apiVersionV2 = import.meta.env.VITE_API_VERSION_V2;

export const load: PageServerLoad = async ({ cookies, url }) => {
	const access_token: string = cookies.get('access_token') || '';
	const exerciseId = url.searchParams.get('exerciseid');
	const sessionId = url.searchParams.get('seshid');

	let languages;
	availableLanguages.subscribe((value) => {
		languages = value;
	})();

	const response = await fetch(`${backendUrl}/${apiVersion}/exercises/${exerciseId}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${access_token}`
		}
	});

	const responseBody = await response.text();
	let jsonResponse;

	if (responseBody) {
		try {
			jsonResponse = JSON.parse(responseBody);
			delete jsonResponse.solution;
			jsonResponse.testCases = jsonResponse.testCases.filter((testCase) => testCase.publicVisible);
		} catch (error) {
			console.error('Failed to parse JSON response:', error);
			throw new Error('Failed to parse JSON response');
		}
	} else {
		jsonResponse = {};
	}

	const testTemplate = {
		parameters: {
			input: jsonResponse.testCases[0].inputParams.map((value, index) => ({
				type: jsonResponse.inputParameterType[index],
				value
			})),
			output: jsonResponse.testCases[0].outputParams.map((value, index) => ({
				type: jsonResponse.outputParamaterType[index],
				value
			}))
		}
	};

	const form = await superValidate(zod(formSchema));

	return {
		form,
		exerciseData: jsonResponse,
		testTemplate,
		languages,
		exerciseId,
        sessionId
	};
};

async function getLanguages(
	backendUrl: string,
	api_version: string,
	access_token: string
): Promise<Response> {
	return await fetch(`${backendUrl}/${api_version}/languages`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${access_token}`
		}
	});
}

function convertFormData(formData, sessionId) {
	return {
		solution: formData.codeText,
		sessionId: sessionId,
		languageId: formData.selectedLanguage.languageId
	};
}

async function postSolution(
	backendUrl: string,
	api_version: string,
	access_token: string,
	apiData,
	exerciseId: int
): Promise<Response> {
	return await fetch(`${backendUrl}/${api_version}/exercises/${exerciseId}/submission`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${access_token}` // Append the Bearer token
		},
		body: JSON.stringify(apiData)
	});
}

export const actions: Actions = {
	postAnon: async (event) => {
		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const exerciseId = event.url.searchParams.get('exerciseid') || 'XXX';
		const sessionId = event.url.searchParams.get('seshid') || 'XXX';
		
		// Convert form data to API format
		const apiData = convertFormData(form.data, sessionId);

		const access_token = event.cookies.get('anon_token');

		const response = await fetch(
			`${backendUrl}/${apiVersionV2}/exercises/${exerciseId}/submission`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${access_token}` // Append the Bearer token
				},
				body: JSON.stringify(apiData)
			}
		);

		if (response.ok) {
			const responseBody = await response.text(); // Read the response as text
			let resJSON;
			if (responseBody) {
				try {
					resJSON = JSON.parse(responseBody); // Try to parse the response as JSON
				} catch (e) {
					console.error('Failed to parse response JSON:', e);
					resJSON = { detail: responseBody }; // If parsing fails, use the text as the response detail
				}
			} else {
				resJSON = { detail: 'No response body' }; // Handle empty response body
			}

			debugExercise('Epic Win:', resJSON);
			throw redirect(303, '/session');
		} else {
			const responseBody = await response.text(); // Read the response as text
			debugExercise('responseBody:', responseBody);
			let error;
			if (responseBody) {
				try {
					const resJSON = JSON.parse(responseBody); // Try to parse the response as JSON
					if (resJSON.testCaseResults) {
						debugExercise('Test case errors:', resJSON.testCaseResults);
						return setError(form, 'test', resJSON.testCaseResults);
					} else if (resJSON.message) {
						// Handle compiler error response
						debugExercise('resJSON.message:', resJSON.message);
						return setError(form, 'codeText', resJSON.message || 'An error occurred on the server');
					} else if (resJSON.errors) {
						// Handle validation error response
						const errorMessages = Object.values(resJSON.errors).flat().join('\n');
						debugExercise('Validation errors:', errorMessages);
						return setError(form, 'codeText', errorMessages || 'An error occurred on the server');
					} else {
						error = { detail: responseBody }; // If no specific error field, use the text as the error detail
					}
				} catch (e) {
					error = { detail: responseBody }; // If parsing fails, use the text as the error detail
				}
			} else {
				error = { detail: 'An unknown error occurred' }; // Handle empty response body
			}

			return setError(form, 'codeText', error.detail || 'An error occurred on the server');
		}
	},
	postStudent: async (event) => {
		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const exerciseId = event.url.searchParams.get('exerciseid') || 'XXX';
		const sessionId = event.url.searchParams.get('seshid') || 'XXX';

		// Convert form data to API format
		const apiData = convertFormData(form.data, sessionId);

		const access_token = event.cookies.get('access_token');

		const response = await fetch(
			`${backendUrl}/${apiVersionV2}/exercises/${exerciseId}/submission`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${access_token}` // Append the Bearer token
				},
				body: JSON.stringify(apiData)
			}
		);

		if (response.ok) {
			const responseBody = await response.text(); // Read the response as text
			let resJSON;
			if (responseBody) {
				try {
					resJSON = JSON.parse(responseBody); // Try to parse the response as JSON
				} catch (e) {
					console.error('Failed to parse response JSON:', e);
					resJSON = { detail: responseBody }; // If parsing fails, use the text as the response detail
				}
			} else {
				resJSON = { detail: 'No response body' }; // Handle empty response body
			}

			debugExercise('Epic Win:', resJSON);
			throw redirect(303, '/session');
		} else {
			const responseBody = await response.text(); // Read the response as text
			debugExercise('responseBody:', responseBody);
			let error;
			if (responseBody) {
				try {
					const resJSON = JSON.parse(responseBody); // Try to parse the response as JSON
					if (resJSON.testCaseResults) {
						debugExercise('Test case errors:', resJSON.testCaseResults);
						return setError(form, 'test', resJSON.testCaseResults);
					} else if (resJSON.message) {
						// Handle compiler error response
						debugExercise('resJSON.message:', resJSON.message);
						return setError(form, 'codeText', resJSON.message || 'An error occurred on the server');
					} else if (resJSON.errors) {
						// Handle validation error response
						const errorMessages = Object.values(resJSON.errors).flat().join('\n');
						debugExercise('Validation errors:', errorMessages);
						return setError(form, 'codeText', errorMessages || 'An error occurred on the server');
					} else {
						error = { detail: responseBody }; // If no specific error field, use the text as the error detail
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
