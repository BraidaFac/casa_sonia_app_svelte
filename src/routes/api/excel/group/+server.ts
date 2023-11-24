// import { PrismaClient } from '@prisma/client';
import { prismaClient } from '$lib/server/prisma';

type GroupCategory = {
	name: string;
};

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

export const POST = async ({ request, locals }) => {
	const session = await locals.auth.validate();
	if (!session || session?.user.rol !== 'ADMIN') {
		return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 400 });
	}
	const responseObj: { error: string[]; status: number } = { error: [], status: 200 };
	try {
		const data = (await request.json()) as Format[][];
		if (data.length === 0) {
			responseObj.error.push('No hay datos.');
			responseObj.status = 400;
			return new Response(JSON.stringify(responseObj.error), { status: responseObj.status });
		}

		if (responseObj.error.length > 0) {
			return new Response(JSON.stringify(responseObj.error), { status: responseObj.status });
		}
		if (sanatizaceSheet(data, responseObj)) {
			return new Response(JSON.stringify(responseObj.error), { status: responseObj.status });
		}
		for (const sheet of data) {
			await processGruops(sheet);
		}
		return new Response(JSON.stringify({ success: true }), { status: 201 });
	} catch (error) {
		console.log(error);
		return new Response(JSON.stringify({ error }), { status: 500 });
	}
};

async function processGruops(sheet: Format[]) {
	const groups_category: GroupCategory[] = [];
	sheet.forEach((row) => {
		if (groups_category.findIndex((item) => item.name === row.GSR) === -1) {
			groups_category.push({ name: row.GSR });
		}
	});
	await prismaClient.groupCategory.deleteMany({});
	await prismaClient.groupCategory.createMany({ data: groups_category });
}

function sanatizaceSheet(
	sheets: Format[][],
	responseObj: { error: string[]; status: number }
): { error: string[]; status: number } | undefined {
	sheets.forEach((sheet, i) => {
		let currentIndex = 0;
		const row = sheet[1];
		for (const header in row) {
			if (header !== HEADER[currentIndex]) {
				responseObj.error.push('Error en los titulos en hoja ' + (i + 1));
				break;
			}
			currentIndex++;
		}
		if (responseObj.error.length === 0) {
			for (const row of sheet) {
				if (
					!row.CODIGO ||
					!row.MARCA ||
					!row.RUBRO ||
					!row.PRECIO ||
					!row.DESCRIPCION ||
					!row.GSR ||
					!row.SR
				) {
					responseObj.error.push(
						'Error en la hoja ' + (i + 1) + ' en la fila ' + (sheet.indexOf(row) + 3)
					);
					break;
				}
			}
		}
	});
	if (responseObj.error.length > 0) {
		responseObj.status = 400;
		return responseObj;
	}
	return undefined;
}

enum HEADER {
	'CODIGO',
	'DESCRIPCION',
	'TALLES',
	'PRECIO',
	'RUBRO',
	'MARCA',
	'SR',
	'GSR'
}
