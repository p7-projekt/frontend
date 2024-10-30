import { jwtDecode } from 'jwt-decode';

export const load: PageServerLoad = async ({ cookies, depends }) => {
	const backendUrl = import.meta.env.VITE_BACKEND_URL;
	const api_version = import.meta.env.VITE_V1;
	const anon_token = cookies.get('anon_token') || '';

	// depends('data:sessions');

	// if (!access_token && !refresh_token) {
	// 	return {
	// 		instructor_exercises: null,
	// 		sessions: null
	// 	};
	// }'

	let decoded_token;
	try {
		decoded_token = jwtDecode(anon_token) as {
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

	console.log(user_id);

	const response = await fetch(`${backendUrl}${api_version}/sessions/${user_id}`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${anon_token}`
		}
	});

	console.log(response);

	// let response = await handleAuthenticatedRequest(
	// 	(token) => fetchExerciseData(backendUrl, api_version, token),
	// 	access_token,
	// 	refresh_token,
	// 	cookies
	// );

	// let instructor_exercises;
	// if (response.ok) {
	// 	instructor_exercises = await response.json();
	// }

	// return {
	// 	instructor_exercises: instructor_exercises,
	// 	sessions: sessions && sessions.length > 0 ? sessions : null
	// };
};
