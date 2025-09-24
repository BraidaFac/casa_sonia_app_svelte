import {
	API_ENDPOINTS,
	EXCLUDED_BRANDS,
	EXCLUDED_CATEGORIES,
	STOCK_LIMIT,
	WAREHOUSE_CODES,
	WAREHOUSE_NAMES
} from '$lib/constants/api.constants';
import type { Article, StockItem } from '$lib/types/article.types';
import { apiService } from './api.service';

/**
 * Servicio para manejo de artículos
 */
export class ArticleService {
	private static readonly ARTICLE_ATTRIBUTES = [
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
	] as const;

	/**
	 * Obtiene artículos con paginación
	 */
	static async fetchArticles(token: string): Promise<Article[]> {
		const response = await apiService.get<Article>(API_ENDPOINTS.PRODUCTOS, token);
		const articles = response.data;

		const processedArticles = this.processArticles(articles);
		const filteredArticles = this.filterActiveArticles(processedArticles);
		const enrichedArticles = this.enrichArticlesWithSearchTerms(filteredArticles);
		const articlesWithStock = await this.addStockInformation(
			enrichedArticles,
			token,
			WAREHOUSE_CODES.RUTA
		);

		return articlesWithStock;
	}

	/**
	 * Procesa artículos para mantener solo los atributos necesarios
	 */
	private static processArticles(articles: any[]): Article[] {
		return articles.map(
			(item) =>
				this.ARTICLE_ATTRIBUTES.reduce((obj: any, key) => {
					obj[key] = item[key];
					return obj;
				}, this.createEmptyArticle()) as Article
		);
	}

	/**
	 * Crea un artículo vacío con valores por defecto
	 */
	private static createEmptyArticle(): Article {
		return {
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
		};
	}

	/**
	 * Filtra artículos activos excluyendo categorías y marcas no deseadas
	 */
	private static filterActiveArticles(articles: Article[]): Article[] {
		return articles.filter(
			(item) =>
				!EXCLUDED_CATEGORIES.includes(item.DESCRIPCIONRUBRO as any) &&
				!EXCLUDED_BRANDS.includes(item.DESCRIPCION_MARCA as any) &&
				item.ACTIVO
		);
	}

	/**
	 * Enriquece artículos con términos de búsqueda y talles procesados
	 */
	private static enrichArticlesWithSearchTerms(articles: Article[]): Article[] {
		return articles.map((item) => ({
			...item,
			searchTerms: this.createSearchTerms(item),
			TALLES: item.TALLES ? this.extractTalles(item.TALLES) : ''
		}));
	}

	/**
	 * Crea términos de búsqueda combinando varios campos
	 */
	private static createSearchTerms(article: Article): string {
		return [
			article.DESCRIPCION_MARCA,
			article.DESCRIPCIONRUBRO,
			article.NOMBRE,
			article.CODIGO_PRODUCTO,
			article.DESCRIPCIONSUPERRUBRO,
			article.DESCRIPCIONGRUPOSUPERRUBRO
		].join(' ');
	}

	/**
	 * Extrae el primer y último talle de una cadena de talles
	 */
	private static extractTalles(talles: string): string {
		const tallesArray = talles.split('|');
		if (tallesArray.length <= 1) return talles;
		return `${tallesArray[0]} | ${tallesArray[tallesArray.length - 1]}`;
	}

	/**
	 * Agrega información de stock a los artículos
	 */
	private static async addStockInformation(
		articles: Article[],
		token: string,
		warehouseCode: string
	): Promise<Article[]> {
		const stockUrl = `${API_ENDPOINTS.STOCK}?codigosdepositos=${warehouseCode}&limit=${STOCK_LIMIT}`;
		const stockResponse = await apiService.get<StockItem>(stockUrl, token);
		const stockData = stockResponse.data;

		const warehouseName = WAREHOUSE_NAMES[warehouseCode as keyof typeof WAREHOUSE_NAMES];

		return articles
			.map((article) => this.attachStockToArticle(article, stockData, warehouseName))
			.filter((article) => this.hasValidStock(article, warehouseName));
	}

	/**
	 * Adjunta información de stock a un artículo
	 */
	private static attachStockToArticle(
		article: Article,
		stockData: StockItem[],
		warehouseName: string
	): Article {
		const articleStocks = stockData.filter((stock) => stock.CODIGOARTICULO === article.ID_ARTICULO);

		const enrichedArticle = {
			...article,
			searchTerms: this.createSearchTerms(article),
			TALLES: article.TALLES ? this.extractTalles(article.TALLES) : '',
			stocks: {}
		};

		enrichedArticle.stocks[warehouseName] = articleStocks.length > 0 ? articleStocks : null;

		return enrichedArticle;
	}

	/**
	 * Verifica si un artículo tiene stock válido
	 */
	private static hasValidStock(article: Article, warehouseName: string): boolean {
		return !!(article.stocks && article.stocks[warehouseName] !== null && article.STOCKTOTAL > 0);
	}
}
