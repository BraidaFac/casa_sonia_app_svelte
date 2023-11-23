import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
//import { prismaClient } from '$lib/server/prisma';
//import { PrismaClient } from '@prisma/client';
import {prismaClient} from "../../lib/server/prisma"

export const load: PageServerLoad = async ({ params }) => {
	
	const group_category_name = params.gsr;
	const group_category = await prismaClient.groupCategory.findUnique({
		where: {
			name: group_category_name.toUpperCase()
		}
	});
	if (!group_category) {
		throw error(404, 'No existe el grupo de categoría');
	}
	const super_categories = await prismaClient.superCategory.findMany({
		where: {
			group_category_id: group_category?.id
		}
	});
	return { 	super_categories:orderSuperCategory(super_categories)
		, group_category};
};
function orderSuperCategory(super_categories: any[]){
	super_categories.sort(
		function (a, b) {
			if (a.name > b.name) {
			  return 1;
			}
			if (a.name < b.name) {
			  return -1;}

			return 0;
		  })
		
		return super_categories;}