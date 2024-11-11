import { describe, it, expect, vi } from 'vitest';
import { POST } from '$src/routes/api/logout/+server';

describe('POST /logout', () => {
	it('deletes access_token and refresh_token cookies and returns a success message', async () => {
		// Arrange
		const mockCookies = {
			delete: vi.fn()
		};

		// Act
		// Call the POST handler for logout
		const response = POST({ cookies: mockCookies });
		const jsonResponse = await response.json();

		// Assert
		// Verify response status and message
		expect(response.status).toBe(200);
		expect(jsonResponse).toEqual({ message: 'User successfully logged out' });

		// Verify that cookies were deleted
		expect(mockCookies.delete).toHaveBeenCalledWith('access_token', { path: '/', secure: false });
		expect(mockCookies.delete).toHaveBeenCalledWith('refresh_token', { path: '/', secure: false });
	});
});
