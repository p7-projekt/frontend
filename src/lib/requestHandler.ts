import { redirect, type Cookies } from '@sveltejs/kit';

// Run request function; if access_token is expired, refresh and rerun the request function
export async function handleAuthenticatedRequest(
	requestFunction: (access_token: string) => Promise<Response>,
	access_token: string,
	refresh_token: string | undefined,
	cookies: Cookies,
	fetch: typeof globalThis.fetch // Accept `fetch` as an argument
): Promise<any> {
	let response = await requestFunction(access_token);

	if ((response.status === 401 || response.status === 404) && refresh_token) {
		// Use the provided `fetch` here
		const refreshResponse = await fetch('/api/refresh', { method: 'POST' });

		if (refreshResponse.ok) {
			const newAccessToken = cookies.get('access_token') || '';
			response = await requestFunction(newAccessToken);

			if (response.ok) {
				return await response.json();
			}
		}
		cookies.delete('access_token', { path: '/' });
		cookies.delete('refresh_token', { path: '/' });
		throw redirect(303, '/');
	}

	if (response.ok) {
		return await response.json();
	}

	throw new Error('Request failed');
}
