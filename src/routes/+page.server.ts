import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { ENDPOINT_API } from '$env/static/private';
import { redisClientInit } from '$lib/utils/redis';
import type { Article } from '$lib/utils/types.utils';

export const ssr = false;
export const load: PageServerLoad = async ({ locals, cookies, depends }) => {
	depends('app:main');

	const session = await locals.auth.validate();
	const token = cookies.get('Authorization');
	if (!session || !token) {
		throw redirect(301, '/login');
	}
	const validateToken = await fetch(ENDPOINT_API + '/auth/me', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `${token}`
		}
	});

	if (validateToken.status !== 200) {
		locals.auth.setSession(null);
		throw redirect(301, '/login');
	}
	const client = await redisClientInit();
	try {
		const articulos: Article[] = JSON.parse(await client.get('articulos'));
		return { token, articulos };
	} catch (err) {
		throw error(500, 'Error al obtener los articulos');
	} finally {
		client.disconnect();
	}
};
