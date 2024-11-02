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
	const exerciseId = url.searchParams.get('exerciseid') || 'XXX';
	const sessionId = url.searchParams.get('seshid') || 'XXX';

	const response = await fetch(`${backendUrl}${api_version}/exercises/${exerciseId}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${access_token}`	
	}});

	const responseBody = await response.text();
	let jsonResponse;

    if (responseBody) {
        try {
            jsonResponse = JSON.parse(responseBody);
            delete jsonResponse.solution;
        } catch (error) {
            console.error('Failed to parse JSON response:', error);
            throw new Error('Failed to parse JSON response');
        }
    } else {
        jsonResponse = {};
    }

    console.log(jsonResponse);

    return {
        form: await superValidate(zod(formSchema)),
        exerciseData: jsonResponse
    };
};

function convertFormData(formData, sessionId) {
	return {
		"solution": formData.codeText,
		"sessionId": sessionId,
	}
}



export const actions: Actions = {
    default: async (event) => {
        const form = await superValidate(event, zod(formSchema));
        if (!form.valid) {
            return fail(400, { form });
        }

		const exerciseId = event.url.searchParams.get('exerciseid') || 'XXX';
		const sessionId = event.url.searchParams.get('seshid') || 'XXX';

        // Convert form data to API format
        const apiData = convertFormData(form.data, sessionId);



        const access_token = event.cookies.get('access_token');
        const refresh_token = event.cookies.get('refresh_token');
  
		console.log('apiData:', apiData);

        const response = await handleAuthenticatedRequest(
            (token) => postExercise(backendUrl, apiVersion, token, apiData),
            access_token,
            refresh_token,
            event.cookies
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
			console.log('responseBody:', responseBody);
            let error;
            if (responseBody) {
				try {
					const resJSON = JSON.parse(responseBody); // Try to parse the response as JSON
					if (resJSON.errors) {
						const errorMessages = Object.values(resJSON.errors)
							.flat()
							.join('\n'); // Flatten and join all error messages
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