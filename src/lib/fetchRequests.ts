import { jwtDecode } from 'jwt-decode';

export async function fetchCreateSession(
	backendUrl: string,
	api_version: string,
	access_token: string,
	new_session: { title: string; description: string; expiresInHours: number; exerciseIds: number[] }
): Promise<Response> {
	return await fetch(`${backendUrl}/${api_version}/sessions`, {
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
	return await fetch(`${backendUrl}/${api_version}/sessions`, {
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
	return await fetch(`${backendUrl}/${api_version}/sessions/${session_id}`, {
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
	return await fetch(`${backendUrl}/${api_version}/exercises`, {
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
	const user_id = get_userID(access_token);

	return await fetch(`${backendUrl}/${api_version}/users/${user_id}`, {
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
	return await fetch(`${backendUrl}/${api_version}/sessions/${session_id}`, {
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
	return await fetch(`${backendUrl}/${api_version}/exercises/${exercise_id}`, {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${access_token}`
		}
	});
}

export function get_userID(access_token: string) {
	let decoded_token;
	try {
		decoded_token = jwtDecode(access_token) as {
			'http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata': string;
		};
		if (decoded_token) {
			return decoded_token['http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata'];
		}
	} catch (error) {
		console.error('Invalid token:', error.message);
		return null;
	}
}