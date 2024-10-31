import type { LayoutServerLoad } from './$types';
import { handleAuthenticatedRequest, fetchUserData } from '$lib/requestHandler';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const backendUrl = import.meta.env.VITE_BACKEND_URL;
	const api_version = import.meta.env.VITE_V1;
	const access_token: string = cookies.get('access_token') || '';
	const refresh_token: string = cookies.get('refresh_token') || '';

	if (!access_token && !refresh_token) {
		return { user: null };
	}

	const userData = await handleAuthenticatedRequest(
		(token) => fetchUserData(backendUrl, api_version, token),
		access_token,
		refresh_token,
		cookies
	);

	const user = {
		name: userData.name
	};
	return {
		user
	};
};
