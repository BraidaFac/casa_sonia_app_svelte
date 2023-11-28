import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
//import { PrismaClient } from '@prisma/client';
import { prismaClient } from '$lib/server/prisma';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw redirect(301, '/login');
	}

	const groups_category = await prismaClient.groupCategory.findMany();
	const products = await prismaClient.product.findMany({
		include: {
			brand: true,
			category: true
		}
	});

	return { groups_category, products: orderProducts(products) };
};

function orderProducts(products: any[]) {
	products.sort(function (a, b) {
		if (a.brand.name > b.brand.name) {
			return 1;
		}
		if (a.brand.name < b.brand.name) {
			return -1;
		}
		if (a.description > b.description) {
			return 1;
		}
		if (a.description < b.description) {
			return -1;
		}
		return 0;
	});

	return products;
}
