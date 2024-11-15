import type { LayoutServerLoad } from './$types';
import { fetchUserData } from '$lib/fetchRequests';
import { handleAuthenticatedRequest } from '$lib/requestHandler';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const backendUrl = import.meta.env.VITE_BACKEND_URL;
	const api_version = import.meta.env.VITE_API_VERSION_V1;
	const access_token: string = cookies.get('access_token') || '';
	const refresh_token: string = cookies.get('refresh_token') || '';

	if (!access_token && !refresh_token) {
		return { user: null };
	}

	const response = await handleAuthenticatedRequest(
		(token) => fetchUserData(backendUrl, api_version, token),
		access_token,
		refresh_token,
		cookies
	);

	let userData;
	if (response.ok) {
		userData = await response.json();
	}
	return {
		user: userData ? { name: userData.name } : null
	};
};
