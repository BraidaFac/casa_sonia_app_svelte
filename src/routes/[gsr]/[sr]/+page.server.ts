import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import { prismaClient } from '$lib/server/prisma';

export const load: PageServerLoad = async ({ params }) => {
	const super_category_id = params.sr;
	const super_category = await prismaClient.superCategory.findUnique({
		where: {
			id: super_category_id
		}
	});
	if (!super_category) {
		throw error(404, 'No existe el grupo de categoría');
	}
	const categories = await prismaClient.category.findMany({
		where: {
			super_category_id: super_category.id
		}
	});
	const all_products = await prismaClient.product.findMany({
		include: {
			brand: true,
			category: true
		}
	});
	const brandes = await prismaClient.brand.findMany();
	const brandes_to_show: any[] = [];
	const products_to_show: any[] = [];
	//filters
	categories.forEach((category) => {
		const products_by_category = all_products.filter(
			(product) => product.category_id === category.id
		);
		products_to_show.push(...products_by_category);
	});
	products_to_show.forEach((product) => {
		const brand = brandes.find((brand) => brand.id === product.brand_id);
		brandes_to_show.findIndex((brand) => brand.id === product.brand_id) === -1
			? brandes_to_show.push(brand)
			: null;
	});
	return {
		ordered_products: orderProducts(products_to_show),
		categories,
		brandes: orderBrandes(brandes_to_show)
	};
};
//sort products
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
function orderBrandes(brandes: any[]) {
	brandes.sort(function (a, b) {
		if (a.name > b.name) {
			return 1;
		}
		if (a.name < b.name) {
			return -1;
		}

		return 0;
	});

	return brandes;
}
