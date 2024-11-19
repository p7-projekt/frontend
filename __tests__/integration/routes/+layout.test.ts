import { describe, it, expect, vi } from 'vitest';
import { _validate_url_path, load } from '../../../src/routes/+layout';
import { redirect } from '@sveltejs/kit';

vi.mock('@sveltejs/kit', () => ({
	redirect: vi.fn()
}));

describe('load function', () => {
	it('redirects to the home page if a logged-in user accesses /login', () => {
		const mockUser = { name: 'John Doe', role: "Student" };
		const data = { user: mockUser };
		const url = { pathname: '/login' };

		expect(() => load({ data, url })).toThrow();
		expect(redirect).toHaveBeenCalledWith(303, '/');
	});

	it('returns user data if no redirect is needed', () => {
		const data = { user: null };
		const url = { pathname: '/join' };

		const result = load({ data, url });
		expect(result).toEqual({ user: null });
	});

	it('redirects to home if user is null and accessing a restricted path', () => {
		const data = null;
		const url = { pathname: '/restricted' };

		expect(() => load({ data, url })).toThrow();
		expect(redirect).toHaveBeenCalledWith(303, '/');
	});
});

describe('get_anon_userID', () => {
	it('should redirect unauthorized user when accessing unauthorized url ', () => {
		// Arrange
		const user = null;
		const url_path = '/create-session';

		// Act and Assert
		expect(() => _validate_url_path(user, url_path)).toThrow();
		expect(redirect).toHaveBeenCalledWith(303, '/');
	});

	it('should redirect authorized user when accessing login url ', () => {
		const user = { name: 'Andreas', role: "Student" };
		const url_path = '/login';
		expect(() => _validate_url_path(user, url_path)).toThrow();
		expect(redirect).toHaveBeenCalledWith(303, '/');
	});
});
