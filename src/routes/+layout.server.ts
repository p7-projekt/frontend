import type { LayoutServerLoad } from './$types';
import { fetchUserData } from '$lib/fetchRequests';
import { handleAuthenticatedRequest } from '$lib/requestHandler';
import { get_user_role } from '$lib/getrole';

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

	let userRole;
	let userData;
	if (response.ok) {
		userData = await response.json();
		const access_token_: string = cookies.get('access_token') || '';
		userRole = get_user_role(access_token_);
	}
	return {
		user: userData && userRole ? { name: userData.name, role: userRole } : null
	};
};
