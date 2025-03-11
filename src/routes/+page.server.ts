import { API_DEVICE, API_PASSWORD, API_USER, ENDPOINT_API } from '$env/static/private';
import { readFileSync } from 'fs';
import { join } from 'path';
import { read, utils } from 'xlsx';

export const ssr = false;
const login = async (fetch) => {
	const response = await fetch(`${ENDPOINT_API}/auth/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			username: API_USER,
			password: API_PASSWORD,
			deviceinfo: API_DEVICE
		})
	});
	if (response.status !== 200) {
		throw new Error('Failed to login');
	}
	return (await response.json()).token;
};

const validateToken = async (token) => {
	const response = await fetch(`${ENDPOINT_API}/auth/me`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `${token}`
		}
	});
	return response.status === 200;
};

export const load = async ({ cookies, depends, fetch }) => {
	depends('app:main');

	let token = cookies.get('Authorization');

	if (!token || !(await validateToken(token))) {
		token = `Bearer ${await login(fetch)}`;
		cookies.set('Authorization', `Bearer ${token}`, { path: '/' });
	}

	//const client = await redisClientInit();
	//let articulos: Article[] = JSON.parse(await client.get('articulos'));

	//client.disconnect();
	const excelPath = join(process.cwd(), 'static', 'precios.xlsx');
	const workbook = read(readFileSync(excelPath));
	const worksheet = workbook.Sheets[workbook.SheetNames[0]];
	const excelData = utils.sheet_to_json(worksheet);

	let articulos = updateArticlesPrices(excelData);

	return { token, articulos };
};

const updateArticlesPrices = (excelData: any[]) => {
	return excelData.map((row) => {
		return {
			CODIGO_PRODUCTO: row.codigoparticular,
			PRECIOVENTA: row.precioventa,
			searchTerms: row.codigoparticular
		};
	});
};
