import { fetchWithPagination } from '$lib/utils/pagination.utils';
import { redisClientInit } from '$lib/utils/redis';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ cookies, locals }) => {
	const user = await locals.auth.validate();
	if (!user || user?.user.rol !== 'ADMIN') {
		return new Response('Error', { status: 403 });
	}
	const token = cookies.get('Authorization');
	if (!token) {
		return new Response('Error', { status: 401 });
	}
	const connection = await redisClientInit();
	try {
		const articulos = await fetchWithPagination('articulos', 1000, token);
		//console.log('articulos', articulos);
		await connection.set('articulos', JSON.stringify(articulos));
		return new Response('success', { status: 200 });
	} catch (err) {
		return new Response(JSON.stringify(err), { status: 500 });
	} finally {
		await connection.disconnect();
	}
};
