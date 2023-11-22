
import { prismaClient } from "$lib/server/prisma";

type SuperCategory = {
	name: string;
	group_category_id: string;
};
export const POST = async ({ request ,locals}) => {
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
			//await processGruops(sheet);
			await processSuperCategory(sheet);
			//await processCategory(sheet); 
			//await processBrands(sheet);
			//await processProducts(sheet);
		}
		return new Response(JSON.stringify({ success: true }), { status: 201 });
	} catch (error) {
		console.log(error);
		return new Response(JSON.stringify({ error }), { status: 500 });
	}
};
async function processSuperCategory(sheet: Format[]) {
	const super_category: SuperCategory[] = [];
	for (const row of sheet) {
		const gsr = await prismaClient.groupCategory.findUnique({ where: { name: row.GSR } });
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
