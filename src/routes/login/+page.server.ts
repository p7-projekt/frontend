import type { PageServerLoad, Actions } from './$types.js';
import { fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';
// import CryptoJS from 'crypto-js';

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

		const { email, password } = form.data;

		// Make request login post request to backend
		const response = await fetch(backendUrl + '/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email: email, password: password })
		});

		if (response.ok) {
			const resJSON = await response.json();

			const expires_at: Date = new Date(resJSON.expiresAt);

			const { cookies } = event;
			cookies.set('access_token', resJSON.token, {
				path: '/',
				httpOnly: true,
				secure: false, // Use secure for HTTPS-only environments
				sameSite: 'strict'
			});

			cookies.set('refresh_token', resJSON.refreshToken, {
				path: '/',
				expires: expires_at,
				httpOnly: true,
				secure: false, // Use secure for HTTPS-only environments
				sameSite: 'strict'
			});
			throw redirect(303, '/');
		} else {
			const error = await response.json();
			return setError(form, 'password', error?.detail || 'Wrong Email or Password');
		}
	}
};
