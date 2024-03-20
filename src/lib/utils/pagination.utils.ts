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
			item.marca.descripcion !== 'ADMINISTRACION VARIOS' &&
			item.activo
	);

	const sort_articles = orderProducts(active_article);
	const articles_worked = await addPrices(sort_articles, token);

	/* sort_articles.forEach((article) => {
		const price = prices.find((item) => item.codigoarticulo === article.codigoarticulo);
		if (!price) {
			article.precioventa1 = 0;
		} else {
			article.precioventa1 = price.preciolista1;
		}
		article.searchTerm = `${article.marca.descripcion} ${article.rubro.descripcion} ${article.descripcion} ${article.codigoparticular}`;
	});  */

	return articles_worked;
	//const mapped_data_articles: Article[] = data_articles.flatMap((item) => item.data as Article[]);
	//console.log('mapped_data_articles', mapped_data_articles);

	/* for (let i = 0; i < sort_articles.length; i++) {
		try {
			sort_articles[i].searchTerms =
				`${sort_articles[i].marca.descripcion} ${sort_articles[i].rubro.descripcion} ${sort_articles[i].descripcion} ${sort_articles[i].codigoparticular}`;
			const response_article = await instance.get(`/${sort_articles[i].codigoarticulo}/precio`);

			const data_article = await response_article.data.data.preciolista1;
			sort_articles[i].precioventa1 = data_article;
		} catch (error) {
			sort_articles[i].precioventa1 = 0;
		}
	} */
	//return sort_articles;
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

async function addPrices(articles: Article[], token: string) {
	const instance = axios.create({
		baseURL: `${ENDPOINT_API}/articulos/`,
		timeout: 100000,
		headers: {
			'Content-Type': 'application/json',
			Authorization: `${token}`
		}
	});
	const quantity = 25;
	const pages = articles.length / quantity;
	let prices = [];
	for (let i = 0; i < pages; i++) {
		const responses = await Promise.allSettled(
			articles.slice(i * quantity, (i + 1) * quantity).map((item) => {
				{
					return instance.get(`${item.codigoarticulo}/precio`, {
						headers: {
							'Content-Type': 'application/json',
							Authorization: `${token}`
						}
					});
				}
			})
		);

		const newPrices = responses
			.filter((response) => response.status === 'fulfilled')
			.flatMap((item) => item.value.data.data);

		prices = [...prices, ...newPrices];
	}
	articles.forEach((article) => {
		const price = prices.find((item) => item.codigoarticulo === article.codigoarticulo);
		if (!price) {
			article.precioventa1 = 0;
		} else {
			article.precioventa1 = price.preciolista1;
		}
		article.searchTerms = `${article.marca.descripcion} ${article.rubro.descripcion} ${article.descripcion} ${article.codigoparticular}`;
	});
	return articles;
	//create an array wit promises for each article
}
