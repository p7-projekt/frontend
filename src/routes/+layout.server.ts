import type { LayoutServerLoad } from './$types';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const load: LayoutServerLoad = async ({ cookies }) => {
	const access_token = cookies.get('access_token');
	const refresh_token = cookies.get('refresh_token');

	if (!access_token) {
		return { user: null };
	}

	const response = await fetch(`${backendUrl}/secret`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${access_token}`
		}
	});
	// console.log(response);

	if (response.ok) {
		// const user = await response.json();
		const user = {
			name: 'Kristian',
			id: 1
		};
		return {
			user: user
		};
	}
	if (response.status === 401 && refresh_token) {
		const res = await fetch(`${backendUrl}/refresh`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ refreshToken: refresh_token })
		});
		if (res.ok) {
			const resJSON = await res.json();

			const expires_at: Date = new Date(resJSON.expiresAt);

			console.log(resJSON);
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

			const user = {
				name: 'Kristian',
				id: 1
			};
			return {
				user: user
			};
		} else {
			cookies.delete('refresh_token', { path: '/' });
			cookies.delete('access_token', { path: '/' });
		}
	}
};
