import { jwtDecode } from 'jwt-decode';

export function get_user_role(access_token: string) {
	try {
		const decoded_token = jwtDecode(access_token) as {
			'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string;
		};
		if (decoded_token) {
			return decoded_token['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
		}
	} catch (error) {
		console.error('Invalid access_token', error.message);
        return 'AnonymousUser'
	}
}
