// import { PrismaClient } from '@prisma/client';
// const prismaClient = new PrismaClient();
import { prismaClient } from "$lib/server/prisma";
type GroupCategory = {
	name: string;
};

type SuperCategory = {
	name: string;
	group_category_id: string;
};
type Category = {
	name: string;
	super_category_id: string;
};
type Product = {
	article: string;
	price: {
		price: number;
		date: string;
		current_price: boolean;
	};
	category_id: string;
	brand_id: string;
	description: string;
	size: string;
};
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

export const POST = async ({ request }) => {
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
			/* await processGruops(sheet);
			await processSuperCategory(sheet);
			await processCategory(sheet); */
			//await processBrands(sheet);
			await processProducts(sheet);
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

async function processCategory(sheet: Format[]) {
	const categories: Category[] = [];
	for (const row of sheet) {
		const sr = await prismaClient.superCategory.findUnique({ where: { name: row.SR } });
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

async function processProducts(sheet: Format[]) {
	const date = real_time();
	const products: Product[] = [];
	const response = { error: '', status: 200 };
	for (const row of sheet) {
		const category = await prismaClient.category.findUnique({ where: { name: row.RUBRO } });
		if (!category) {
			response.error = 'No existe la categoria ' + row.RUBRO;
			response.status = 404;
			break;
		}
		const brand = await prismaClient.brand.findUnique({ where: { name: row.MARCA } });
		if (!brand) {
			response.error = 'No existe la marca ' + row.MARCA;
			response.status = 404;
			break;
		}
		const product = {
			article: row.CODIGO,
			price: {
				price: parseFloat(String(row.PRECIO).replace(',', '.')),
				date: date.toISOString(),
				current_price: true
			},
			category_id: category.id,
			brand_id: brand.id,
			description: row.DESCRIPCION,
			size: row.TALLES
		};
		products.push(product);
	}
	if (response.error.length > 0) {
		throw response;
	}

	try {
		await prismaClient.product.deleteMany({});
		for (const product of products) {
			await prismaClient.product.create({
				data: {
					article: product.article,
					price: {
						create: product.price
					},
					category_id: product.category_id,
					brand_id: product.brand_id,
					description: product.description,
					size: String(product.size)
				}
			});
		}
	} catch (error) {
		console.log(error);
		response.error = 'Error en el servidor';
		response.status = 500;
		throw response;
	}
	/* await prismaClient.product.upsert({
			where: {
				article: row.CODIGO.toString()
			},
			update: {
				price: {
					updateMany: {
						where: {
							current_price: true
						},
						data: {
							current_price: false
						}
					},
					create: {
						price: Number(row.PRECIO),
						date: date.toISOString(),
						current_price: true
					}
				}
			},
			create: {
				article: row.CODIGO.toString(),
				price: {
					create: {
						price: Number(row.PRECIO),
						date: date.toISOString(),
						current_price: true
					}
				},
				category_id: category[0].id,
				brand_id: brand[0].id,
				description: row?.DESCRIPCION ?? 'No tiene'
			}
		});
	} */
}

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
function sanatizaceSheet(
	sheets: Format[][],
	responseObj: { error: string[]; status: number }
): { error: string[]; status: number } | undefined {
	sheets.forEach((sheet, i) => {
		const row = sheet[1];
		for (const header in row) {
			if (
				!(
					header === HEADER.CODIGO ||
					header === HEADER.MARCA ||
					header === HEADER.PRECIO ||
					header === HEADER.RUBRO ||
					header === HEADER.DESCRIPCION ||
					header === HEADER.GSR ||
					header === HEADER.SR ||
					header === HEADER.TALLES
				)
			) {
				responseObj.error.push('Error en los titulos en hoja ' + (i + 1));
			}
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
		responseObj.status = 404;
		return responseObj;
	}
	return undefined;
}

function real_time(): Date {
	const date = new Date();
	date.setTime(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
	return date;
}

enum HEADER {
	CODIGO = 'CODIGO',
	GSR = 'GSR',
	SR = 'SR',
	RUBRO = 'RUBRO',
	DESCRIPCION = 'DESCRIPCION',
	TALLES = 'TALLES',
	PRECIO = 'PRECIO',
	MARCA = 'MARCA'
}
