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

	const detailedArticles = active_article.map((item) => ({
		...item,
		searchTerms: `${item.DESCRIPCION_MARCA} ${item.DESCRIPCIONRUBRO} ${item.NOMBRE} ${item.CODIGO_PRODUCTO} ${item.DESCRIPCIONSUPERRUBRO} ${item.DESCRIPCIONGRUPOSUPERRUBRO}`,
		TALLES: item.TALLES ? extractTalles(item.TALLES) : ''
	}));

	const articlesWithStockRuta = await addStock(detailedArticles, token, '003');

	return articlesWithStockRuta;
}

function extractTalles(talles: string) {
	const talles_splited = talles.split('|');
	return `${talles_splited[0]} | ${talles_splited[talles_splited.length - 1]}`;
}

async function addStock(articles: Article[], token: string, deposito: string) {
	const instance = axios.create({
		baseURL: `${ENDPOINT_API}`,
		timeout: 1000000,
		headers: {
			'Content-Type': 'application/json',
			Authorization: `${token}`
		}
	});
	const url = `stock?codigosdepositos=${deposito}&limit=5000000`;
	const stock = (await instance.get(url)).data.data;
	const depositoNombre = deposito === '004' ? 'QUIVER' : deposito === '002' ? 'CENTRO' : 'RUTA';
	articles = articles
		.map((item: Article) => {
			const article = {
				...item,
				searchTerms: `${item.DESCRIPCION_MARCA} ${item.DESCRIPCIONRUBRO} ${item.NOMBRE} ${item.CODIGO_PRODUCTO} ${item.DESCRIPCIONSUPERRUBRO} ${item.DESCRIPCIONGRUPOSUPERRUBRO}`,
				TALLES: item.TALLES ? extractTalles(item.TALLES) : ''
			};

			const stocks = stock.filter((s) => s.CODIGOARTICULO === item.ID_ARTICULO);
			if (!article.stocks) {
				article.stocks = {};
			}
			if (stocks.length === 0) {
				article.stocks[depositoNombre] = null;
			} else {
				article.stocks[depositoNombre] = stocks;
			}
			return article;
		})
		.filter(
			(item: Article) => item.stocks && item.stocks[depositoNombre] !== null && item.STOCKTOTAL > 0
		);

	return articles;
}
