import { ENDPOINT_API } from '$env/static/private';

export async function fetchWithPagination(
	path: string,
	quantity: number,
	token: string
): Promise<any | void> {
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
	const mapped_data = data.flatMap((item) => item.data);

	return {
		data: mapped_data
	};
	//console.log(data);
}
