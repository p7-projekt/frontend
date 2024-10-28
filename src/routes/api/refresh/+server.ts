import { redirect, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Internal API endpoint to log the user out
export const POST: RequestHandler = async ({ cookies }) => {
	const refresh_token = cookies.get('refresh_token');

	const response = await fetch(`${backendUrl}/refresh`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ refreshToken: refresh_token })
	});
	// if valid redirect token, then refresh access token; else log out user
	if (response.ok) {
		const resJSON = await response.json();

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

		return json(
			{ access_token: resJSON.token, refresh_token: resJSON.refresh_token },
			{ status: 200 }
		);
	} else {
		return json({ message: 'failed to refresh token' }, { status: 500 });
	}
};
