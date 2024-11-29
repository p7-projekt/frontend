import { fetchClassroomData, fetchSessionsData } from '$lib/fetchRequests';
import { handleAuthenticatedRequest } from '$lib/requestHandler';
import type { PageServerLoad } from './$types';

const backendUrl = import.meta.env.VITE_BACKEND_URL; 
const api_version_v2 = import.meta.env.VITE_API_VERSION_V2;
const api_version_v1 = import.meta.env.VITE_API_VERSION_V1;



export const load: PageServerLoad = async ({ cookies }) => {
	const access_token = cookies.get('access_token') || ''; 
	const refresh_token = cookies.get('refresh_token') || ''; 

     let response;

    response = await handleAuthenticatedRequest(
		(token) => fetchSessionsData(backendUrl, api_version_v1, token),
		access_token,
		refresh_token,
		cookies
	);

	let sessions;
	if (response.ok) {
		sessions = await response.json();
	}

	response = await handleAuthenticatedRequest(
		(token) => fetchClassroomData(backendUrl, api_version_v2, token),
		access_token,
		refresh_token,
		cookies
	);

	let classrooms;
	if (response.ok) {
		classrooms = await response.json();
	}

    return {
        classrooms,
        sessions
    };
};