import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { invalidateAll } from '$app/navigation';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const load: LayoutServerLoad = async ({ cookies, event }) => {
	const access_token = cookies.get('access_token');
	const refresh_token = cookies.get('refresh_token');

	if (!access_token) {
		return { user: null };
	}

	const response = await fetch(`${backendUrl}/v1/users`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${access_token}`
		}
	});
	// console.log(response);

	if (response.ok) {
		const userRes = await response.json();
		const user = {
			name: userRes.name
		};
		return {
			user
		};
	}
	// if response fails, probably due to invalid access token, use redirect token if redirect token exist
	// else log user out
	if (response.status === 401 && refresh_token) {
		const res = await fetch(`${backendUrl}/refresh`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ refreshToken: refresh_token })
		});
		// if valid redirect token, then refresh access token; else log out user
		if (res.ok) {
			const resJSON = await res.json();

			const expires_at: Date = new Date(resJSON.expiresAt);

			cookies.set('access_token', resJSON.token, {
				path: '/',
				httpOnly: true,
				secure: true, // Use secure for HTTPS-only environments
				sameSite: 'strict'
			});

			cookies.set('refresh_token', resJSON.refreshToken, {
				path: '/',
				expires: expires_at,
				httpOnly: true,
				secure: true, // Use secure for HTTPS-only environments
				sameSite: 'strict'
			});

			throw redirect(303, '/');
		} else {
			cookies.delete('access_token', { path: '/' });
			cookies.delete('refresh_token', { path: '/' });

			throw redirect(303, '/');
		}
	} else {
		cookies.delete('access_token', { path: '/' });
		cookies.delete('refresh_token', { path: '/' });

		throw redirect(303, '/');
	}
};
