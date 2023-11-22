
import { prismaClient } from "$lib/server/prisma";

type SuperCategory = {
	name: string;
	group_category_id: string;
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
export const POST = async ({ request ,locals}) => {
	const session = await locals.auth.validate();
	if (!session || session?.user.rol !== 'ADMIN') {
		return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 400 });
	}
	const responseObj: { error: string[]; status: number } = { error: [], status: 200 };
	try {
		const data = (await request.json()) as Format[][];
		for (const sheet of data) {
			//await processGruops(sheet);
			await processSuperCategory(sheet);
			//await processCategory(sheet); 
			//await processBrands(sheet);
			//await processProducts(sheet);
		}
		return new Response(JSON.stringify({ success: true }), { status: 201 });
	} catch (error) {
		return new Response(JSON.stringify({ error }), { status: 500 });
	}
};
async function processSuperCategory(sheet: Format[]) {
	const super_category: SuperCategory[] = []
	const group_categories = await prismaClient.groupCategory.findMany();
	for (const row of sheet) {
		const gsr = group_categories.find((item) => item.name === row.GSR);
		if (!gsr) {
			continue;
		}
		const sr = { name: row.SR, group_category_id: gsr.id };
		if (super_category.findIndex((item) => item.name === row.SR) === -1) {
			super_category.push(sr);
		}
	}
	await prismaClient.superCategory.deleteMany({});
	await prismaClient.superCategory.createMany({ data: super_category });
}
