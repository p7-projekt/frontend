import { redirect, type Cookies } from '@sveltejs/kit';
import { jwtDecode } from 'jwt-decode';

export function get_anon_userID(anon_token: string, cookies: Cookies) {
	try {
		const decoded_token = jwtDecode(anon_token) as {
			'http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata': string;
		};
		if (decoded_token) {
			return decoded_token['http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata'];
		}
	} catch (e) {
		cookies.delete('anon_token', { path: '/', secure: false });
		throw redirect(303, '/join');
	}
}
