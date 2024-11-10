import { redirect, type Cookies } from '@sveltejs/kit';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Run request function; if access_token is expired, refresh and rerun the request function
export async function handleAuthenticatedRequest(
	requestFunction: (access_token: string) => Promise<Response>,
	access_token: string,
	refresh_token: string,
	cookies: Cookies
): Promise<any> {
	const response = await requestFunction(access_token);
	if (response.ok) {
		return response;
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

			// Return new response after refresh
			return await requestFunction(resJSON.token);
		} else {
			cookies.delete('access_token', { path: '/', secure: false });
			cookies.delete('refresh_token', { path: '/', secure: false });
			throw redirect(303, '/login');
		}
	}
	// If refresh token is invalid, log user out
	else if (response.status === 401 || response.status === 404) {
		cookies.delete('access_token', { path: '/', secure: false });
		cookies.delete('refresh_token', { path: '/', secure: false });
		throw redirect(303, '/login');
	} else {
		return response;
	}
}
