import { ArticleService } from '$lib/services/article.service';
import type { Article } from '$lib/types/article.types';

/**
 * @deprecated Use ArticleService.fetchArticles instead
 * Esta función se mantiene por compatibilidad pero se recomienda usar el nuevo servicio
 */
export async function fetchWithPagination(path: string, token: string): Promise<Article[]> {
	console.warn('fetchWithPagination is deprecated. Use ArticleService.fetchArticles instead.');
	return ArticleService.fetchArticles(token);
}
