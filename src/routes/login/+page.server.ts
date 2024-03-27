import { auth } from '$lib/server/lucia';
import { LuciaError } from 'lucia';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { API_PASSWORD, API_DEVICE, API_USER, ENDPOINT_API } from '$env/static/private';

export const load: PageServerLoad = (async ({ locals, cookies }) => {
	const session = await locals.auth.validate();
	const token = cookies.get('Authorization');
	if (session && token) {
		throw redirect(302, '/');
	}
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, locals, cookies, fetch }) => {
		const { username, password } = Object.fromEntries(await request.formData()) as Record<
			string,
			string
		>;
		try {
			const user = await auth.useKey('username', username.toLowerCase(), password);
			const session = await auth.createSession({ userId: user.userId, attributes: {} });
			const response = await fetch(`${ENDPOINT_API}/auth/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: new URLSearchParams({
					username: API_USER,
					password: API_PASSWORD,
					deviceinfo: API_DEVICE
				})
			});
			if (response.status !== 200) {
				throw new Error();
			}
			const token = (await response.json()).token;
			cookies.set('Authorization', `Baerer ${token}`, { path: '/' });
			locals.auth.setSession(session);
			throw redirect(302, '/');
		} catch (err) {
			if (err instanceof LuciaError) {
				return {
					user: username,
					message: 'Credenciales incorrectas'
				};
			} else {
				return {
					user: username,
					message: 'ERROR : ' + err.message
				};
			}
		}
	}
} satisfies Actions;
