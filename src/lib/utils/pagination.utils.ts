import { ENDPOINT_API } from '$env/static/private';
import type { Article } from './types.utils';

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
	const active_article = mapped_data
		.filter((item) => item.rubro.descripcion !== 'Z ARTICULOS INACTIVOS' && item.activo)
		.map((item) => {
			return {
				...item,
				precioventa1: item.precioventa1 * 1.21,
				searchTerms: `${item.marca.descripcion} ${item.rubro.descripcion} ${item.descripcion}`
			};
		});

	return active_article;
}
