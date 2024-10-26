import type { PageServerLoad, Actions } from './$types.js';
import { fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const load: PageServerLoad = async () => {
    return {
        form: await superValidate(zod(formSchema))
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

        // Make request login post request to backend
        const response = await fetch(backendUrl + '/createexercise', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(form.data)
        });

        if (response.ok) {
            const resJSON = await response.json();
 
        } else {
            const error = await response.json();
            return setError(form, 'email', error?.detail || 'Login failed');
        }
    }
};