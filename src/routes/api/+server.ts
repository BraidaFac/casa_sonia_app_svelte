import type { Article } from '$lib/types/article.types';
import { setRedisData } from '$lib/utils/redis-helpers';
import type { RequestHandler } from '@sveltejs/kit';

interface ArticlesCacheRequest {
	articulos: Article[];
}

/**
 * Endpoint para cachear artículos en Redis
 */
export const POST: RequestHandler = async ({ request }) => {
	try {
		const requestData = await parseRequestData(request);
		const { articulos } = requestData;

		if (!isValidArticlesData(articulos)) {
			return createErrorResponse('No hay artículos válidos para cachear', 400);
		}

		const success = await cacheArticles(articulos);

		if (!success) {
			return createErrorResponse('Error al cachear artículos', 500);
		}

		return createSuccessResponse('Artículos cacheados exitosamente');
	} catch (error) {
		console.error('Error en API de cache de artículos:', error);
		return createErrorResponse(error.message, 500);
	}
};

/**
 * Parsea y valida los datos de la request
 */
async function parseRequestData(request: Request): Promise<ArticlesCacheRequest> {
	const data = await request.json();

	if (!data || typeof data !== 'object') {
		throw new Error('Datos de request inválidos');
	}

	return data as ArticlesCacheRequest;
}

/**
 * Valida que los datos de artículos sean válidos
 */
function isValidArticlesData(articulos: any): articulos is Article[] {
	return Array.isArray(articulos) && articulos.length > 0;
}

/**
 * Cachea los artículos en Redis con TTL de 20 horas
 */
async function cacheArticles(articulos: Article[]): Promise<boolean> {
	const TTL_HOURS = 20;
	const TTL_SECONDS = TTL_HOURS * 60 * 60;

	return await setRedisData('CASASONIA', articulos, TTL_SECONDS);
}

/**
 * Crea una respuesta de error
 */
function createErrorResponse(message: string, status: number): Response {
	return new Response(JSON.stringify({ error: message }), {
		status,
		headers: { 'Content-Type': 'application/json' }
	});
}

/**
 * Crea una respuesta de éxito
 */
function createSuccessResponse(message: string): Response {
	return new Response(JSON.stringify({ message }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	});
}
