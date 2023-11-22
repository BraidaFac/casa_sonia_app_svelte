
import { prismaClient } from "$lib/server/prisma";
type Brand = {
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
export const POST = async ({ request ,locals}) => {
	const session = await locals.auth.validate();
	if (!session || session?.user.rol !== 'ADMIN') {
		return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 400 });
	}
	const responseObj: { error: string[]; status: number } = { error: [], status: 200 };
	try {
		const data = (await request.json()) as Format[][];
		for (const sheet of data) {
			await processBrands(sheet);
		}
		return new Response(JSON.stringify({ success: true }), { status: 201 });
	} catch (error) {
		return new Response(JSON.stringify({ error }), { status: 500 });
	}
};
async function processBrands(sheet: Format[]) {
	const brandes: Brand[] = [];
	sheet.forEach((row) => {
		if (brandes.findIndex((item) => item.name === row.MARCA) === -1) {
			brandes.push({ name: row.MARCA });
		}
	});
    
	await prismaClient.brand.deleteMany({});
	await prismaClient.brand.createMany({ data: brandes });
}