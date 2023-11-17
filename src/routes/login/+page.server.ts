import { auth } from '$lib/server/lucia';
import { LuciaError } from 'lucia';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = (async ({ locals }) => {
	const session = await locals.auth.validate();
	if (session) {
		throw redirect(302, '/');
	}
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const { username, password } = Object.fromEntries(await request.formData()) as Record<
			string,
			string
		>;
		try {
			const user = await auth.useKey('username', username.toLowerCase(), password);
			const session = await auth.createSession({ userId: user.userId, attributes: {} });
			locals.auth.setSession(session);

			redirect(304, '/');
		} catch (err) {
			if (err instanceof LuciaError) {
				return {
					user: username,
					message: err.message
				};
			}
		}
	}
} satisfies Actions;
