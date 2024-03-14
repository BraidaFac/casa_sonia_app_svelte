import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { ENDPOINT_API } from '$env/static/private';
import { redisClientInit } from '$lib/utils/redis';
import type { Article } from '$lib/utils/types.utils';

export const ssr = false;
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
		console.log('Error fetching grupo_super_rubros:', resonse_grupo_super_rubro);

		throw error(500, 'Error API');
	}
	const { data: grupo_super_rubros } = await resonse_grupo_super_rubro.json();

	const client = await redisClientInit();
	const articulos: Article[] = JSON.parse(await client.get('articulos'));

	return { grupo_super_rubros, token, articulos };
};
