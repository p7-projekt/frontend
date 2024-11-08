import { describe, it, expect } from 'vitest';
import { _validate_url_path } from '../../../src/routes/+layout';

describe('get_anon_userID', () => {
	it('should redirect unauthorized user when accessing unauthorized url ', () => {
		const user = null;
		const url_path = '/create-session';
		try {
			_validate_url_path(user, url_path);
		} catch (error) {
			// Check that the `redirect` throws an object with status and location
			expect(error.status).toBe(303);
			expect(error.location).toBe('/');
		}
	});
	it('should redirect authorized user when accessing login url ', () => {
		const user = { name: 'Andreas' };
		const url_path = '/login';
		try {
			_validate_url_path(user, url_path);
		} catch (error) {
			// Check that the `redirect` throws an object with status and location
			expect(error.status).toBe(303);
			expect(error.location).toBe('/login');
		}
	});
});
