import { fetchWithPagination } from '../../src/lib/utils/pagination.utils';
import { redisClientInit } from './../../src/lib/utils/redis';
import type { Config } from '@netlify/functions';

export default async () => {
	const client = await redisClientInit();
	try {
		const response = await fetch(`${process.env.ENDPOINT_API}/auth/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				username: process.env.API_USER ?? '',
				password: process.env.API_PASSWORD ?? '',
				deviceinfo: process.env.API_DEVICE ?? ''
			})
		});
		if (response.status !== 200) {
			throw new Error();
		}
		const token = (await response.json()).token;
		const articulos = await fetchWithPagination('articulos', 1000, token);
		client.set('articulos', JSON.stringify(articulos));
	} catch (error) {
		console.log(error);
	} finally {
		client.disconnect();
	}
};

export const config: Config = {
	schedule: '@hourly'
};
