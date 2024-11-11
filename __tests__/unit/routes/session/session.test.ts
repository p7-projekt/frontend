import { describe, it, expect, vi } from 'vitest';
import { get_anon_userID } from '../../../../src/routes/session/session'; // Adjust the path to your function module

// Mock the `cookies` object interface

describe('get_anon_userID', () => {
	it('should return the user ID when a valid token is provided', () => {
		const expected_userID = '5';
		const anon_token =
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3VzZXJkYXRhIjoiNSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFub255bW91c1VzZXIiLCJleHAiOjE3MzEwNTc0MTAsImlzcyI6IkJhY2tlbmRlciIsImF1ZCI6IkZyb250ZW5kIn0.eo-XYlFt_q9jVLCnqLqLJhAURFkKpXWOGBg_XoMVNmk';
		const mockCookies = {
			get: vi.fn().mockReturnValue(anon_token), // Mock `get` to return the token
			getAll: vi.fn(),
			set: vi.fn(),
			delete: vi.fn(),
			serialize: vi.fn()
		};

		// Call `get_anon_userID` with the mocked `cookies` object
		const result = get_anon_userID(anon_token, mockCookies);

		expect(result).toEqual(expected_userID);
	});

	it('should redirect and delete the token when an invalid token is provided', () => {
		const invalid_token = 'invalid token';
		const mockCookies = {
			get: vi.fn().mockReturnValue(invalid_token), // Mock `get` to return the invalid token
			getAll: vi.fn(),
			set: vi.fn(),
			delete: vi.fn(),
			serialize: vi.fn()
		};

		try {
			get_anon_userID(invalid_token, mockCookies);
		} catch (error) {
			// Check that the `redirect` throws an object with status and location
			expect(error.status).toBe(303);
			expect(error.location).toBe('/join');
		}
		// Ensure `cookies.delete` was called
		expect(mockCookies.delete).toHaveBeenCalledWith('anon_token', { path: '/', secure: false });
	});
});
