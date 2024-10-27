import { redirect, type Cookies, json } from '@sveltejs/kit';

// Run request function; if access_token is expired, refresh and rerun the request function
export async function handleAuthenticatedRequest(
	requestFunction: (access_token: string) => Promise<Response>,
	access_token: string,
	refresh_token: string | undefined,
	cookies: Cookies,
	fetch: typeof globalThis.fetch // Accept `fetch` as an argument
): Promise<any> {
	let response = await requestFunction(access_token);

	// In case of invalid access token we want to try to refresh it
	if ((response.status === 401 || response.status === 404) && refresh_token) {
		const baseUrl = import.meta.env.VITE_FRONTEND_URL || '';
		const refreshResponse = await fetch(`${baseUrl}/api/refresh`, { method: 'POST' });

		if (refreshResponse.ok) {
			const newAccessToken = cookies.get('access_token') || '';
			response = await requestFunction(newAccessToken);

			if (response.ok) {
				return await response.json();
			}
		}
		cookies.delete('access_token', { path: '/' });
		cookies.delete('refresh_token', { path: '/' });
		throw redirect(303, '/login');
	}
	// If refresh token is invalid, log user out
	if (response.status === 401 || response.status === 404) {
		cookies.delete('access_token', { path: '/' });
		cookies.delete('refresh_token', { path: '/' });
		throw redirect(303, '/login');
	}

	if (response.ok) {
		// Check if response has a body
		const text = await response.text();
		return text ? JSON.parse(text) : json({ message: 'Session deleted' }, { status: 200 }); // Return parsed JSON or null if no body
	}

	throw new Error('Request failed');
}
