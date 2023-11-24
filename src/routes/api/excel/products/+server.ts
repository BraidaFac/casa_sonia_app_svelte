// import { PrismaClient } from '@prisma/client';
import { prismaClient } from '$lib/server/prisma';

type Product = {
	article: string;
	price: number;
	category_id: string;
	brand_id: string;
	description: string;
	size: string;
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
			await processProducts(sheet);
		}
		return new Response(JSON.stringify({ success: true }), { status: 201 });
	} catch (error) {
		return new Response(JSON.stringify({ error }), { status: 500 });
	}
};

async function processProducts(sheet: Format[]) {
	const products: Product[] = [];
	const response = { error: '', status: 200 };
	const categories = await prismaClient.category.findMany();
	const brandes = await prismaClient.brand.findMany();
	for (const row of sheet) {
		const category = categories.find((item) => item.name === row.RUBRO);
		if (!category) {
			response.error = 'No existe la categoria ' + row.RUBRO;
			response.status = 404;
			break;
		}
		const brand = brandes.find((item) => item.name === row.MARCA);
		if (!brand) {
			response.error = 'No existe la marca ' + row.MARCA;
			response.status = 404;
			break;
		}
		const product = {
			article: row.CODIGO,
			price: Math.trunc(parseFloat(String(row.PRECIO).replace(',', '.'))),
			category_id: category.id,
			brand_id: brand.id,
			description: row.DESCRIPCION,
			size: String(row.TALLES)
		};
		products.push(product);
	}
	if (response.error.length > 0) {
		throw response;
	}

	try {
		await prismaClient.product.deleteMany({});
		await prismaClient.product.createMany({ data: products });
	} catch (error) {
		console.log(error);

		response.error = 'Error en el servidor';
		response.status = 500;
		throw response;
	}
}
