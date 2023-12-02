import type { Actions } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prismaClient } from '$lib/server/prisma';

export const load: PageServerLoad = (async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session || session?.user.rol !== 'ADMIN') {
		throw redirect(302, '/');
	}
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async () => {
		const products = await prismaClient.product.findMany({
			include: {
				brand: true,
				category: true
			}
		});
		const super_categories = await prismaClient.superCategory.findMany();
		const super_groups = await prismaClient.groupCategory.findMany();

		const products_mapped = products.map((product) => {
			const super_category = super_categories.find(
				(super_category) => super_category.id === product.category.super_category_id
			);
			if (super_category) {
				const super_group = super_groups.find(
					(super_group) => super_group.id === super_category.group_category_id
				);
				return {
					GSR: super_group.name,
					SR: super_category.name,
					MARCA: product.brand.name,
					DESCRIPCION: product.description,
					TALLES: product.size,
					PRECIO: product.price
				};
			}
		});
		return orderProducts(products_mapped);
	}
};
//sort products
function orderProducts(products: any[]) {
	products.sort(function (a, b) {
		if (a.GSR > b.GSR) {
			return 1;
		}
		if (a.GSR < b.GSR) {
			return -1;
		}

		if (a.SR > b.SR) {
			return 1;
		}
		if (a.SR < b.SR) {
			return -1;
		}
		if (a.MARCA > b.MARCA) {
			return 1;
		}
		if (a.MARCA < b.MARCA) {
			return -1;
		}
		if (a.DESCRIPCION > b.DESCRIPCION) {
			return 1;
		}
		if (a.DESCRIPCION < b.DESCRIPCION) {
			return -1;
		}
		return 0;
	});

	return products;
}
