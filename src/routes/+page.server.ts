import { API_DEVICE, API_PASSWORD, API_USER } from '$env/static/private';
import { ArticleService } from '$lib/services/article.service';
import { AuthService } from '$lib/services/auth.service';
import type { Article } from '$lib/types/article.types';
import { getRedisData } from '$lib/utils/redis-helpers';

export const ssr = false;

/**
 * Maneja la autenticación y carga de datos para la página principal
 */
export const load = async ({ cookies, depends, fetch }) => {
	depends('app:main');

	const token = await handleAuthentication(cookies, fetch);
	const articulos = await loadArticlesFromCache();

	return {
		token,
		articulos,
		coeficients: [] // Placeholder para coeficientes
	};
};

/**
 * Maneja el proceso de autenticación
 */
async function handleAuthentication(cookies: any, fetch: typeof globalThis.fetch): Promise<string> {
	let token = cookies.get('Authorization');

	const isTokenValid = token && (await AuthService.validateToken(token));

	if (!isTokenValid) {
		const newToken = await AuthService.login(fetch, API_USER, API_PASSWORD, API_DEVICE);
		token = AuthService.formatToken(newToken);
		cookies.set('Authorization', token, { path: '/' });
	}

	return token;
}

/**
 * Carga artículos desde la cache de Redis
 */
async function loadArticlesFromCache(): Promise<Article[]> {
	try {
		const articulos = await getRedisData('CASASONIA');
		const enrichedArticles = ArticleService.enrichArticlesWithSearchTerms(articulos);

		return Array.isArray(enrichedArticles) ? enrichedArticles : [];
	} catch (error) {
		console.error('Error loading articles from cache:', error);
		return [];
	}
}
