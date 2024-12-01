import { jwtDecode } from 'jwt-decode';

export async function fetchCreateSession(
	backendUrl: string,
	api_version: string,
	access_token: string,
	new_session: {
		title: string;
		description: string;
		expiresInHours: number;
		exerciseIds: number[];
		languageIds: number[];
	}
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

export async function fetchLanguageData(
	backendUrl: string,
	api_version: string,
	access_token: string
): Promise<Response> {
	return await fetch(`${backendUrl}/${api_version}/languages`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${access_token}`
		}
	});
}

export async function fetchCreateClassroom(
	backendUrl: string,
	api_version: string,
	access_token: string,
	new_classroom: {
		title: string;
		description: string;
	}
): Promise<Response> {
	return await fetch(`${backendUrl}/${api_version}/classrooms`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${access_token}`
		},
		body: JSON.stringify(new_classroom)
	});
}

export async function fetchSpecificClassroom(
	backendUrl: string,
	api_version: string,
	access_token: string,
	classroom_id: number
): Promise<Response> {
	return await fetch(`${backendUrl}/${api_version}/classrooms/${classroom_id}`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${access_token}`
		}
	});
}

export async function fetchClassroomData(
	backendUrl: string,
	api_version: string,
	access_token: string
): Promise<Response> {
	return await fetch(`${backendUrl}/${api_version}/classrooms`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${access_token}`
		}
	});
}

export async function fetchDeleteClassroom(
	backendUrl: string,
	api_version: string,
	access_token: string,
	classroom_id: number
): Promise<Response> {
	return await fetch(`${backendUrl}/${api_version}/classrooms/${classroom_id}`, {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${access_token}`
		}
	});
}

export async function fetchCreateClassroomSession(
	backendUrl: string,
	api_version: string,
	access_token: string,
	new_session: {
		title: string;
		description: string;
		exerciseIds: number[];
		languageIds: number[];
	},
	classroom_id: number
): Promise<Response> {
	return await fetch(`${backendUrl}/${api_version}/classrooms/${classroom_id}/session`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${access_token}`
		},
		body: JSON.stringify(new_session)
	});
}  

export async function fetchSpecificClassroomSession(
	backendUrl: string,
	api_version: string,
	access_token: string,
	session_id: number
): Promise<Response> {
	return await fetch(`${backendUrl}/${api_version}/classrooms/session/${session_id}`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${access_token}`
		}
	});
}

export async function fetchUpdateClassroomSession(
	backendUrl: string,
	api_version: string,
	access_token: string,
	session: {
		id: number;
		title: string;
		description: string;
		exerciseIds: number[];
		languageIds: number[];
		status: boolean;
	},
	classroom_id: number
): Promise<Response> {
	return await fetch(`${backendUrl}/${api_version}/classrooms/${classroom_id}/session`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${access_token}`
		},
		body: JSON.stringify(session)
	});
}

export async function fetchUpdateClassroom(
	backendUrl: string,
	api_version: string,
	access_token: string,
	classroom: {
		title: string;
		description: string;
		registrationOpen: boolean;
	},
	classroom_id: number
): Promise<Response> {
	return await fetch(`${backendUrl}/${api_version}/classrooms/${classroom_id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${access_token}`
		},
		body: JSON.stringify(classroom)
	});
}

export async function fetchLeaveClassroom(
	backendUrl: string,
	api_version: string,
	access_token: string,
	classroom_id: number
): Promise<Response> {
	return await fetch(`${backendUrl}/${api_version}/classrooms/${classroom_id}/leave`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${access_token}`
		},
		body: JSON.stringify(classroom_id)
	});
}
  
export async function getSessionDashboard(
	backendUrl: string,
	api_version: string,
	access_token: string,
	sessionId: string
): Promise<Response> {
	return await fetch(`${backendUrl}/${api_version}/dashboard/${sessionId}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${access_token}` // Append the Bearer token
		}
	});
}

export async function fetchSolution( 
    exerciseId: number,
    userId: number
): Promise<Response> {
    return await fetch('/api/dashboard/solution', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ exerciseId, userId })
	});
}