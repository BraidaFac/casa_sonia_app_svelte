import type { Article } from './types.utils';
import axios from 'axios';
const ENDPOINT_API = 'https://casasonia.procomisp.com.ar/v5';
export async function fetchWithPagination(
	path: string,
	quantity: number,
	token: string
): Promise<Article[]> {
	const response_count = await fetch(`${ENDPOINT_API}/${path}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `${token}`
		}
	});
	const { count } = await response_count.json();
	const pages = Math.ceil(count / quantity);
	const promises = [];
	Array.from({ length: pages }).forEach((_, i: number) => {
		promises.push(
			fetch(`${ENDPOINT_API}/${path}?limit=${quantity}&offset=${i * quantity}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `${token}`
				}
			})
		);
	});
	const responses = await Promise.all(promises);
	const data = await Promise.all(responses.map((response) => response.json()));
	const mapped_data: Article[] = data.flatMap((item) => item.data as Article[]);
	const articleAtributes = [
		'codigoarticulo',
		'descripcion',
		'codigoparticular',
		'precioventa1',
		'preciocompra',
		'activo',
		'marca',
		'rubro'
	];
	const reduced_data = mapped_data.map((item) => {
		return articleAtributes.reduce(
			(obj: Article, key) => {
				obj[key] = item[key];
				return obj;
			},
			{
				codigoarticulo: '',
				descripcion: '',
				codigoparticular: '',
				precioventa1: 0,
				preciocompra: 0,
				activo: false,
				marca: {
					codigomarca: '',
					descripcion: ''
				},
				rubro: {
					codigorubro: '',
					descripcion: '',
					codigosuperrubro: ''
				}
			}
		);
	});
	const active_article = reduced_data.filter(
		(item) =>
			item.rubro.descripcion !== 'Z ARTICULOS INACTIVOS' &&
			item.marca.descripcion !== 'CASA SONIA LETRAS' &&
			item.activo
	);

	const sort_articles = orderProducts(active_article);

	const instance = axios.create({
		baseURL: `${ENDPOINT_API}/articulos`,
		timeout: 5000,
		headers: {
			'Content-Type': 'application/json',
			Authorization: `${token}`
		}
	});

	for (let i = 0; i < sort_articles.length; i++) {
		try {
			sort_articles[i].searchTerms =
				`${sort_articles[i].marca.descripcion} ${sort_articles[i].rubro.descripcion} ${sort_articles[i].descripcion} ${sort_articles[i].codigoparticular}`;
			const response_article = await instance.get(`/${sort_articles[i].codigoarticulo}/precio`);

			const data_article = await response_article.data.data.preciolista1;
			sort_articles[i].precioventa1 = data_article;
		} catch (error) {
			sort_articles[i].precioventa1 = 0;
		}
	}
	return sort_articles;
}

function orderProducts(products) {
	products.sort(function (a, b) {
		if (a.marca.descripcion > b.marca.descripcion) {
			return 1;
		}
		if (a.marca.descripcion < b.marca.descripcion) {
			return -1;
		}
		if (a.descripcion > b.descripcion) {
			return 1;
		}
		if (a.descripcion < b.descripcion) {
			return -1;
		}
		return 0;
	});

	return products;
}
