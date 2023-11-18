import type { PageServerLoad } from './$types';
import { PrismaClient } from '@prisma/client';

export const load: PageServerLoad = async () => {
	const prismaClient = new PrismaClient();
	const groups_category = prismaClient.groupCategory.findMany();

	return { groups_category };
};
