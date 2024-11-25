import type { PageServerLoad } from './$types';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const apiVersionV1 = import.meta.env.VITE_API_VERSION_V1;
const apiVersionV2 = import.meta.env.VITE_API_VERSION_V2;

export const load = (async ({ cookies, url }) => {
    const access_token: string = cookies.get('access_token') || '';
    const exerciseId = url.searchParams.get('exerciseid');   

    const sessionId = url.pathname.split('/')[2];

    const response = await getTimedSession(backendUrl, apiVersionV1, access_token, sessionId);
  
    let jsonResponse;

    if (response.ok) {
      try {
        jsonResponse = await response.json(); 
      } catch (error) {
        console.error('Failed to parse JSON response:', error);
        throw new Error('Failed to parse JSON response');
      }
    } else {
      jsonResponse = {};
    }

  

    return {
        dashData: jsonResponse,
    };
}) satisfies PageServerLoad;

async function getTimedSession(
	backendUrl: string,
	api_version: string,
	access_token: string,
  sessionId: string,
): Promise<Response> {
	return await fetch(`${backendUrl}/${api_version}/dashboard/timedSession/${sessionId}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${access_token}` // Append the Bearer token
		}
	});
}