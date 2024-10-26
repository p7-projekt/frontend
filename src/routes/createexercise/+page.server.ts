import type { PageServerLoad, Actions } from './$types.js';
import { fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const apiVersion = import.meta.env.VITE_APIVERSION;

export const load: PageServerLoad = async () => {
    return {
        form: await superValidate(zod(formSchema))
    };
};

const convertFormData = (formData: any) => {
    return {
        name: formData.title,
        description: formData.description,
        solution: formData.codeText,
        inputParameterType: formData.testCases[0].parameters.input.map((param:any) => param.type),
        outputParamaterType: formData.testCases[0].parameters.output.map((param:any) => param.type),
        testcases: formData.testCases.map((testCase:any) => ({
            inputParams: testCase.parameters.input.map((param:any) => param.value),
            outputParams: testCase.parameters.output.map((param:any) => param.value)
        }))
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

        // Convert form data to API format
        const apiData = convertFormData(form.data);

        // Make request login post request to backend
        const response = await fetch(`${backendUrl}/${apiVersion}/exercises`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}` // Append the Bearer token
            },
            body: JSON.stringify(apiData)
        });

        if (response.ok) {
            const resJSON = await response.json();
			console.log('great success: Form Data:', form.data);
			
        } else {
            const error = await response.json();
            return setError(form, error?.detail || 'Create Exercise failed on the server');
        }
    }
};