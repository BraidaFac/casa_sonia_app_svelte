import type { RequestHandler } from '@sveltejs/kit';
import { redisClientInit } from '$lib/utils/redis';

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();
	const articulos = data.articulos;
	console.log('articu', articulos);
	if (!articulos) return new Response('No hay articulos', { status: 400 });
	try {
		const client = await redisClientInit();
		await client.set('articulos', JSON.stringify(articulos));
		await client.disconnect();
		return new Response('success', { status: 200 });
	} catch (err) {
		console.log(err);

		return new Response('Error', { status: 500 });
	}
};
