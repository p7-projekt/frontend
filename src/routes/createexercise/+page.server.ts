import type { PageServerLoad, Actions } from './$types.js';
import { error, fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const apiVersion = import.meta.env.VITE_V1;

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(formSchema))
	};
};

const convertFormData = (formData) => {
	return {
		name: formData.title,
		description: formData.description,
		solution: formData.codeText,
		inputParameterType: formData.testCases[0].parameters.input.map(
			(param: IParameter) => param.type
		),
		outputParamaterType: formData.testCases[0].parameters.output.map((param: any) => param.type),
		testcases: formData.testCases.map((testCase: any) => ({
			inputParams: testCase.parameters.input.map((param: any) => param.value),
			outputParams: testCase.parameters.output.map((param: any) => param.value),
			publicVisible: testCase.publicVisible
		}))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		// Convert form data to API format
		const apiData = convertFormData(form.data);
		const access_token = event.cookies.get('access_token');

		// Make request login post request to backend
		const response = await fetch(`${backendUrl}${apiVersion}/exercises`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${access_token}` // Append the Bearer token
			},
			body: JSON.stringify(apiData)
		});

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

			console.log('resJSON:', resJSON);

			if (resJSON.isFailed) {
				const errorMessages = resJSON.errors.map((err) => err.message).join('\n');
				console.log('Epic fail from server:', resJSON);
				return setError(form, 'codeText', errorMessages || 'An error occurred on the server');
			} else {
				console.log('Epic Win:', resJSON);
				throw redirect(303, '/');
			}
		} else {
			const responseBody = await response.text(); // Read the response as text
			console.log(responseBody); 

			const resJSON = JSON.parse(responseBody); // Try to parse the response as JSON

            if (resJSON.type) {
                const errorMessages = Object.values(resJSON.errors).flat().join('\n'); 
                return setError(form, 'codeText', errorMessages || 'An error occurred on the server');
            } else {
                const errorMessages = resJSON.errors.map((err) => err.message).join('\n');
                return setError(form, 'codeText', errorMessages || 'An error occurred on the server');
            }
 
		}
	}
};
