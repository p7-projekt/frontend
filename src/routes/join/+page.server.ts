import { fail, redirect } from '@sveltejs/kit';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const api_version = import.meta.env.VITE_V1;

export const actions = {
    join: async ({ request, cookies }) => {
        const form = await request.formData();
        const access_token = cookies.get('access_token');

        // Accessing sessionCode from form data correctly
        const sessionCode = form.get('sessionCode');

        // Creating the joinCode object with the correct value
        const joinCode = {
            SessionCode: sessionCode // Use the extracted value
        };

        try {
            const response = await fetch(`${backendUrl}/join`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${access_token}` // Add auth token if required
                },
                body: JSON.stringify(joinCode)
            });
    
            const responseData = await response.json();
            if (!response.ok) {
                return fail(400, { error: responseData.errors.SessionCode[0]});
            }
            else {
                throw redirect(200, '/session')
            }

        } catch (error) {
            console.error("Error joining Session:", error)
            return fail(500, { message: 'Server error. Please try again later.' });
        }
    }
};

