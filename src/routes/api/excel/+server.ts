import { PrismaClient } from '@prisma/client';

const prismaClient = new PrismaClient();

interface Format {
	CODIGO: string;
	GSR: string;
	SR: string;
	RUBRO: string;
	DESCRIPCION: string;
	TALLES: string;
	PRECIO: string;
	MARCA: string;
}

export const POST = async ({ request }) => {
	const responseObj: { error: string[]; status: number } = { error: [], status: 200 };
	try {
		const data = (await request.json()) as Format[][];
		if (data.length === 0) {
			responseObj.error.push('No hay datos.');
			responseObj.status = 400;
			return new Response(JSON.stringify(responseObj.error), { status: responseObj.status });
		}
		sanatizaceSheet(data, responseObj);

		if (responseObj.error.length > 0) {
			return new Response(JSON.stringify(responseObj.error), { status: responseObj.status });
		}
		for (const sheet of data) {
			await processProducts(sheet);
		}
		return new Response(JSON.stringify({ success: true }), { status: 201 });
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Error del servidor' }), { status: 500 });
	}
};
