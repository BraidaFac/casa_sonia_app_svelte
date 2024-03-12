import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { ENDPOINT_API } from '$env/static/private';
import { fetchWithPagination } from '$lib/utils/pagination.utils';
import { articleStore } from '$lib/stores/articles.store';

export const load: PageServerLoad = async ({ locals, fetch, cookies }) => {
	const session = await locals.auth.validate();
	const token = cookies.get('Authorization');
	if (!session || !token) {
		throw redirect(301, '/login');
	}
	const resonse_grupo_super_rubro = await fetch(`${ENDPOINT_API}/gruposuperrubros?limit=200`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `${token}`
		}
	});
	if (resonse_grupo_super_rubro.status !== 200) {
		throw error(500, 'Error API');
	}
	const { data: grupo_super_rubros } = await resonse_grupo_super_rubro.json();
	let articulos;
	articleStore.subscribe((value) => (articulos = value));

	if (articulos && articulos.length > 0) return { grupo_super_rubros, articulos };
	articulos = (await fetchWithPagination('listadoarticulos', 100, token)).data;
	articleStore.set(orderProducts(articulos));
	return { grupo_super_rubros, articulos: orderProducts(articulos) };
};

function orderProducts(products) {
	products.sort(function (a, b) {
		if (a.DESCRIPCIONMARCA > b.DESCRIPCIONMARCA) {
			return 1;
		}
		if (a.DESCRIPCIONMARCA < b.DESCRIPCIONMARCA) {
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
