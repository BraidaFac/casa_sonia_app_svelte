import { auth } from '$lib/server/lucia';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { registerSchema } from './registerSchema';
import { ZodError } from 'zod';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session || session?.user.rol !== 'ADMIN') {
		throw redirect(302, '/');
	}
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = Object.fromEntries(await request.formData()) as Record<string, string>;
		try {
			const result = registerSchema.parse(formData);
			await auth.createUser({
				key: {
					providerId: 'username',
					providerUserId: result.username.toLowerCase(),
					password: result.password
				},
				attributes: {
					username: result.username,
					rol: 'USER'
				}
			});
		} catch (error) {
			if (error instanceof ZodError) {
				const { fieldErrors: errors } = error.flatten();
				return {
					data: { ...formData },
					errors
				};
			} else {
				console.log(error);

				return {
					message: 'El usuario ya existe'
				};
			}
		}
		throw redirect(302, '/login');
	}
};
