import type { Article } from './types.utils';
import axios from 'axios';
const ENDPOINT_API = 'https://casasonia.procomisp.com.ar/v5';
export async function fetchWithPagination(
	path: string,
	quantity: number,
	token: string
): Promise<Article[]> {
	const responses = await axios.get(`${ENDPOINT_API}/${path}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `${token}`
		}
	});
	const data = responses.data.data;

	const articleAtributes = [
		'ID_ARTICULO',
		'CODIGO_PRODUCTO',
		'NOMBRE',
		'DESCRIPCIONGRUPOSUPERRUBRO',
		'DESCRIPCIONSUPERRUBRO',
		'DESCRIPCIONRUBRO',
		'DESCRIPCION_MARCA',
		'TALLES',
		'STOCKTOTAL',
		'PRECIOVENTA',
		'ACTIVO'
	];
	const reduced_data = data.map((item) => {
		return articleAtributes.reduce(
			(obj: Article, key) => {
				obj[key] = item[key];
				return obj;
			},
			{
				ID_ARTICULO: '',
				CODIGO_PRODUCTO: '',
				NOMBRE: '',
				DESCRIPCIONGRUPOSUPERRUBRO: '',
				DESCRIPCIONSUPERRUBRO: '',
				DESCRIPCIONRUBRO: '',
				DESCRIPCION_MARCA: '',
				TALLES: '',
				STOCKTOTAL: 0,
				PRECIOVENTA: 0,
				ACTIVO: 0
			}
		);
	});
	const active_article = reduced_data.filter(
		(item) =>
			item.DESCRIPCIONRUBRO !== 'Z ARTICULOS INACTIVOS' &&
			item.DESCRIPCION_MARCA !== 'CASA SONIA LETRAS' &&
			item.DESCRIPCION_MARCA !== 'ADMINISTRACION VARIOS' &&
			item.ACTIVO
	);

	const sort_articles = orderProducts(
		active_article.map((item) => ({
			...item,
			searchTerms: `${item.DESCRIPCION_MARCA} ${item.DESCRIPCIONRUBRO} ${item.NOMBRE} ${item.CODIGO_PRODUCTO} ${item.DESCRIPCIONSUPERRUBRO} ${item.DESCRIPCIONGRUPOSUPERRUBRO}`,
			PRECIOEFECTIVO: item.PRECIOVENTA * 0.8,
			TALLES: item.TALLES ? extractTalles(item.TALLES) : ''
		}))
	);
	//const articles_worked = await addPrices(sort_articles, token);

	/* sort_articles.forEach((article) => {
		const price = prices.find((item) => item.codigoarticulo === article.codigoarticulo);
		if (!price) {
			article.precioventa1 = 0;
		} else {
			article.precioventa1 = price.preciolista1;
		}
		article.searchTerm = `${article.marca.descripcion} ${article.rubro.descripcion} ${article.descripcion} ${article.codigoparticular}`;
	});  */

	return sort_articles;
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

function extractTalles(talles: string) {
	const talles_splited = talles.split('|');
	return `${talles_splited[0]} | ${talles_splited[talles_splited.length - 1]}`;
}

function orderProducts(products) {
	products.sort(function (a, b) {
		if (a.DESCRIPCION_MARCA > b.DESCRIPCION_MARCA) {
			return 1;
		}
		if (a.DESCRIPCION_MARCA < b.DESCRIPCION_MARCA) {
			return -1;
		}
		if (a.NOMBRE > b.NOMBRE) {
			return 1;
		}
		if (a.NOMBRE < b.NOMBRE) {
			return -1;
		}
		return 0;
	});

	return products;
}

/* async function addPrices(articles: Article[], token: string) {
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
		); */

/* 		const newPrices = responses
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
	return articles; */
//create an array wit promises for each article
