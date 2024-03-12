/* import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { prismaClient } from '$lib/server/prisma';

export const load: PageServerLoad = (async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session || session?.user.rol !== 'ADMIN') {
		throw redirect(302, '/');
	}
	return {
		group_categories: await prismaClient.groupCategory.findMany()
	};
}) satisfies PageServerLoad;
export const actions: Actions = {
	create: async ({ request }) => {
		const { name ,img_src} = Object.fromEntries(await request.formData()) as {
			name: string;
            img_src: string;
		};
		try { 
			await prismaClient.groupCategory.create({ data: { name } });
		} catch (err) {
			return JSON.stringify(err);
		}
	},
	delete: async ({ request, url }) => {
		try {
			const id = url.searchParams.get('id');
			if (!id) {
				return {
					status: 400,
					body: { error: 'Bad request' }
				};
			}
			await prismaClient.groupCategory.delete({ where: { id: id } });
		} catch (err) {
			return  {
                status: 500,
                body: { error: err }
            };
		}
	}
}; */
