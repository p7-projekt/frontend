import { redirect, type Cookies, json } from '@sveltejs/kit';
const backendUrl = import.meta.env.VITE_BACKEND_URL || '';

// Run request function; if access_token is expired, refresh and rerun the request function
export async function handleAuthenticatedRequest(
	requestFunction: (access_token: string) => Promise<Response>,
	access_token: string,
	refresh_token: string,
	cookies: Cookies
): Promise<any> {
	let response = await requestFunction(access_token);
	if (response.ok) {
		// Check if response has a body
		const text = await response.text();
		return text ? JSON.parse(text) : json({ message: 'Session deleted' }, { status: 200 }); // Return parsed JSON or null if no body
	}
	// In case of invalid access token we want to try to refresh it
	else if ((response.status === 401 || response.status === 404) && refresh_token) {
		const refresh_response = await fetch(`${backendUrl}/refresh`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ refreshToken: refresh_token })
		});

		if (refresh_response.ok) {
			const resJSON = await refresh_response.json();

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

			response = await requestFunction(resJSON.token);

			if (response.ok) {
				const text = await response.text();
				return text ? JSON.parse(text) : json({ message: 'Success' }, { status: 200 });
			}
		} else {
			cookies.delete('access_token', { path: '/' });
			cookies.delete('refresh_token', { path: '/' });
			throw redirect(303, '/login');
		}
	}
	// If refresh token is invalid, log user out
	else if (response.status === 401 || response.status === 404) {
		cookies.delete('access_token', { path: '/' });
		cookies.delete('refresh_token', { path: '/' });
		throw redirect(303, '/login');
	} else throw new Error('Request failed');
}
