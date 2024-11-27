import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Define a Zod schema for the session code and nickname
const sessionCodeSchema = z.object({
    sessionCode: z
        .string()
        .length(6, { message: 'Session code must be exactly 6 characters' })
        .regex(/^[A-Z]{2}\d{4}$/, {
            message: 'Session code must start with 2 uppercase letters followed by 4 digits'
        })
        .refine(
            (value) => {
                // Check if the last 4 digits are between 1000 and 9999
                const numberPart = parseInt(value.slice(2), 10);
                return numberPart >= 1000 && numberPart <= 9999;
            },
            { message: 'The last 4 digits must be a number between 1000 and 9999' }
        ),
    nickname: z
        .string()
        .min(5, { message: 'Nickname must be at least 5 characters long' })
        .max(100, { message: 'Nickname must be at most 100 characters long' })
        .optional()
});

export async function load({ parent }) {
    const { user } = await parent();
    return { user };
}

export const actions = {
    join: async ({ request, cookies}) => {
        const form = await request.formData();
		const access_token = cookies.get('access_token') 

        const sessionCode = form.get('sessionCode');
        const nickname = form.get('nickname');
        const validation = sessionCodeSchema.safeParse({ sessionCode, nickname });
        if (!validation.success) {
            // Return the first validation error message if validation fails
            return fail(400, { error: validation.error.errors[0].message });
        }

        const joinCode = {
            SessionCode: sessionCode,
            Name: nickname || "Anonymous"
        };

        const response = await fetch(`${backendUrl}/join`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
				Authorization: `Bearer ${access_token}`		
            },
            body: JSON.stringify(joinCode)
        });

        const responseData = await response.json();
        if (!response.ok) {
			if (responseData.errors?.Errors[0] === 'Already joined') {
				throw redirect(303, '/session/'); 
			}
            return fail(400, { error: responseData.errors?.SessionCode?.[0] || 'Invalid code' });
        }
		
		if (access_token == null) {
			const token = responseData.token;
			if (!token) {
				return fail(500, { message: 'Server error. Please try again later.' });
			}
			const token_expiration = responseData.expiresAt;

			const expires_at: Date = new Date(token_expiration);
			cookies.set('anon_token', token, {
				path: '/',
				httpOnly: true,
				secure: false,
				sameSite: 'strict',
	            expires: expires_at
        });

		} 
        
        throw redirect(303, '/session');
    }
};