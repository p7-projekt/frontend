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
        // Fetch exercise data logic here...
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
            Authorization: `Bearer ${access_token}`
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
            Authorization: `Bearer ${access_token}`
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

            debugCreateExercise('Successful post:', resJSON);
            throw redirect(303, '/');
        } else {
            const responseBody = await response.text(); // Read the response as text
            debugCreateExercise('responseBody:', responseBody);
            let error;
            if (responseBody) {
                try {
                    const resJSON = JSON.parse(responseBody); // Try to parse the response as JSON
                    if (resJSON.testCaseResults) {
                        // Handle test case error response
                        const testCaseErrors = resJSON.testCaseResults
                            .filter((result) => result.testResult === 'failure')
                            .map((result) => `Test case ${result.id} failed: ${result.cause}`);
                        debugCreateExercise('Test case errors:', testCaseErrors);
                        return setError(form, 'codeText', testCaseErrors.join('\n') || 'An error occurred on the server');
                    } else if (resJSON.message) {
                        // Handle compiler error response
                        debugCreateExercise('resJSON.message:', resJSON.message);
                        return setError(form, 'codeText', resJSON.message || 'An error occurred on the server');
                    } else if (resJSON.errors) {
                        // Handle validation error response
                        const errorMessages = Object.values(resJSON.errors)
                            .flat()
                            .join('\n');
                        debugCreateExercise('Validation errors:', errorMessages);
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