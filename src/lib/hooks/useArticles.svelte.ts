import { ArticleService } from '$lib/services/article.service';
import type { Article } from '$lib/types/article.types';
import { LoadingUtils } from '$lib/utils/loading.utils';
import { NotificationUtils } from '$lib/utils/notification.utils';

/**
 * Hook personalizado para manejo de artículos
 */
export function createArticlesHook() {
	let articles = $state<Article[]>([]);
	let isLoading = $state(false);
	let loadingProgress = $state(0);

	/**
	 * Carga artículos desde la API
	 */
	async function loadArticles(token: string): Promise<void> {
		if (isLoading) return;

		try {
			startLoading();
			const fetchedArticles = await ArticleService.fetchArticles(token);
			const enrichedArticles = ArticleService.enrichArticlesWithSearchTerms(fetchedArticles);
			const orderedArticles = orderProducts(enrichedArticles);

			await cacheArticles(orderedArticles);

			articles = orderedArticles;
		} catch (error) {
			console.error('Error cargando artículos:', error);
			NotificationUtils.showArticleLoadError();
		} finally {
			stopLoading();
		}
	}

	function orderProducts(products) {
		products.sort(function (a, b) {
			if (a.DESCRIPCION_MARCA > b.DESCRIPCION_MARCA) {
				return 1;
			}
			if (a.DESCRIPCION_MARCA < b.DESCRIPCION_MARCA) {
				return -1;
			}
			if (a.DESCRIPCIONGRUPOSUPERRUBRO > b.DESCRIPCIONGRUPOSUPERRUBRO) {
				return 1;
			}
			if (a.DESCRIPCIONGRUPOSUPERRUBRO < b.DESCRIPCIONGRUPOSUPERRUBRO) {
				return -1;
			}
			if (a.DESCRIPCIONSUPERRUBRO > b.DESCRIPCIONSUPERRUBRO) {
				return 1;
			}
			if (a.DESCRIPCIONSUPERRUBRO < b.DESCRIPCIONSUPERRUBRO) {
				return -1;
			}
			if (a.DESCRIPCIONRUBRO > b.DESCRIPCIONRUBRO) {
				return 1;
			}
			if (a.DESCRIPCIONRUBRO < b.DESCRIPCIONRUBRO) {
				return -1;
			}
			return 0;
		});

		return products;
	}

	/**
	 * Cachea artículos en el servidor
	 */
	async function cacheArticles(articlesToCache: Article[]): Promise<void> {
		try {
			const response = await fetch('/api', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					articulos: articlesToCache
				})
			});

			if (!response.ok) {
				throw new Error(`Error cacheando artículos: ${response.status}`);
			}
		} catch (error) {
			console.error('Error cacheando artículos:', error);
			// No lanzamos el error para no interrumpir el flujo principal
		}
	}

	/**
	 * Inicia el estado de carga
	 */
	function startLoading(): void {
		isLoading = true;
		LoadingUtils.startProgressInterval('articles', (progress) => {
			loadingProgress = progress;
		});
	}

	/**
	 * Detiene el estado de carga
	 */
	function stopLoading(): void {
		isLoading = false;
		LoadingUtils.stopProgressInterval('articles', (progress) => {
			loadingProgress = progress;
		});
	}

	/**
	 * Actualiza la lista de artículos
	 */
	function updateArticles(newArticles: Article[]): void {
		articles = newArticles;
	}

	/**
	 * Verifica si hay artículos cargados
	 */
	function hasArticles(): boolean {
		return articles.length > 0;
	}

	return {
		get articles() {
			return articles;
		},
		get isLoading() {
			return isLoading;
		},
		get loadingProgress() {
			return loadingProgress;
		},
		loadArticles,
		updateArticles,
		hasArticles
	};
}
