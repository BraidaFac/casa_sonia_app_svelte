import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
//import { PrismaClient } from '@prisma/client';
import { prismaClient } from "$lib/server/prisma";

export const load: PageServerLoad = async ({locals}) => {

	const session = await locals.auth.validate();
	if (!session) {
		throw redirect(301, '/login');
	}

	const groups_category = prismaClient.groupCategory.findMany();

	return { groups_category };
};
