import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
//import { prismaClient } from '$lib/server/prisma';
//import { PrismaClient } from '@prisma/client';
import {prismaClient} from "$lib/server/prisma"

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

	const products=[];

	for (const category of categories) {
		const products_by_category = await prismaClient.product.findMany({
			where: {
				category_id: category.id
			},
			include:{
				brand:true,
				category:true,
			},
			
			

		});
		products.push(...products_by_category);
	}
	const ordered_products=orderProducts(products);
	return {ordered_products, categories};
	// return { ordered_products:ordered_products.map((product) => {
	// 	const words = product.description.split(' '); // Dividir la descripción en palabras
	// 	words.pop(); // Eliminar la última palabra del array
	// 	const newDescription = words.join(' ');
	// 	return {
	// 		...product, description:newDescription}
	// 	}) };
	}
function orderProducts(products: any[]){
products.sort(
	function (a, b) {
		if (a.brand.name > b.brand.name) {
		  return 1;
		}
		if (a.brand.name < b.brand.name) {
		  return -1;}
		if(a.description > b.description){
			return 1;	
		}
		if(a.description < b.description){
			return -1;	
		}
		return 0;
	  })
	
	return products;}
