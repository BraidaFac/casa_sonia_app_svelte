import { prismaClient } from '$lib/server/prisma';

type Category = {
	name: string;
	super_category_id: string;
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
	try {
		const data = (await request.json()) as Format[][];
		for (const sheet of data) {
			await processCategory(sheet);
			//await processBrands(sheet);
			//await processProducts(sheet);
		}
		return new Response(JSON.stringify({ success: true }), { status: 201 });
	} catch (error) {
		return new Response(JSON.stringify({ error }), { status: 500 });
	}
};

async function processCategory(sheet: Format[]) {
	const categories: Category[] = [];
	const super_categories = await prismaClient.superCategory.findMany();
	for (const row of sheet) {
		const sr = super_categories.find((item) => item.name === row.SR);
		if (!sr) {
			continue;
		}
		const category = { name: row.RUBRO, super_category_id: sr.id };
		if (categories.findIndex((item) => item.name === row.RUBRO) === -1) {
			categories.push(category);
		}
	}
	await prismaClient.category.deleteMany({});
	await prismaClient.category.createMany({ data: categories });
}
