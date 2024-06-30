import type { RequestHandler } from '@sveltejs/kit';
import { prismaClient } from '$lib/server/prisma';
export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();
	const { coef_3, coef_6, coef_efect } = data;
	if (!coef_3 || !coef_6 || !coef_efect) return new Response('No hay coef', { status: 400 });

	try {
		await prismaClient.coeficient.deleteMany();
		await prismaClient.coeficient.createMany({
			data: [
				{ name: 'coef_efect', value: +coef_efect },
				{ name: 'coef_3', value: +coef_3 },
				{ name: 'coef_6', value: +coef_6 }
			]
		});
		return new Response('success', { status: 200 });
	} catch (err) {
		return new Response('Error', { status: 500 });
	}
};
