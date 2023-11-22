import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { prismaClient } from '$lib/server/prisma';

export const load: PageServerLoad = (async ({ params, locals }) => {
	const session = await locals.auth.validate();
	if (!session || session?.user.rol !== 'ADMIN') {
		throw redirect(302, '/');
	}
    const gsr= await prismaClient.groupCategory.findUnique({
        where: {
            id: params.id
        }})
    return {gsr}
	}) satisfies PageServerLoad;
export const actions: Actions = {
	default: async ({ request, params }) => {
		const {
			name,
			src_img
		} = Object.fromEntries(await request.formData()) as {
			name: string;
			src_img: string;
		};
        
        
		try {
			const gsr=await prismaClient.groupCategory.update({
				where: { id: params.id },
				data: { superCategories:undefined }
			});
			return {
				status: 201
			};
		} catch (err) {
            console.log('err',err);
            
			return {
				status: 501,
				body: { error: "Error en el servidor" }
			};
		}
	}
};