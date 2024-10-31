import { redirect, type Cookies, json } from '@sveltejs/kit';
import { jwtDecode } from 'jwt-decode';
const backendUrl = import.meta.env.VITE_BACKEND_URL || '';

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

			// Return new response after refresh
			return await requestFunction(resJSON.token);
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
	} else {
		return response;
	}
}

export async function fetchCreateSession(
	backendUrl: string,
	api_version: string,
	access_token: string,
	new_session: { title: string; description: string; expiresInHours: number; exerciseIds: number[] }
): Promise<Response> {
	return await fetch(`${backendUrl}${api_version}/sessions`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${access_token}`
		},
		body: JSON.stringify(new_session)
	});
}

export async function fetchSessionsData(
	backendUrl: string,
	api_version: string,
	access_token: string
): Promise<Response> {
	return await fetch(`${backendUrl}${api_version}/sessions`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${access_token}`
		}
	});
}
export async function fetchSpecificSession(
	backendUrl: string,
	api_version: string,
	access_token: string,
	session_id: number
): Promise<Response> {
	return await fetch(`${backendUrl}${api_version}/sessions/${session_id}`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${access_token}`
		}
	});
}

export async function fetchExerciseData(
	backendUrl: string,
	api_version: string,
	access_token: string
): Promise<Response> {
	return await fetch(`${backendUrl}${api_version}/exercises`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${access_token}`
		}
	});
}

export async function fetchUserData(
	backendUrl: string,
	api_version: string,
	access_token: string
): Promise<Response> {
	let decoded_token;
	try {
		decoded_token = jwtDecode(access_token) as {
			'http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata': string;
		};
	} catch (error) {
		console.error('Invalid token:', error.message);
		decoded_token = null;
	}
	let user_id;
	if (decoded_token) {
		user_id = decoded_token['http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata'];
	}

	return await fetch(`${backendUrl}${api_version}/users/${user_id}`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${access_token}`
		}
	});
}

export async function fetchDeleteSession(
	backendUrl: string,
	api_version: string,
	access_token: string,
	session_id: number
): Promise<Response> {
	return await fetch(`${backendUrl}${api_version}/sessions/${session_id}`, {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${access_token}`
		}
	});
}

export async function fetchDeleteExercise(
	backendUrl: string,
	api_version: string,
	access_token: string,
	exercise_id: number
): Promise<Response> {
	return await fetch(`${backendUrl}${api_version}/exercises/${exercise_id}`, {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${access_token}`
		}
	});
}
