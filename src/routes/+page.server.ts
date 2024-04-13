import { redisClientInit } from '$lib/utils/redis';
import { API_PASSWORD, API_DEVICE, API_USER, ENDPOINT_API } from '$env/static/private';
import type { Article } from '$lib/utils/types.utils';

const login = async (fetch) => {
	const response = await fetch(`${ENDPOINT_API}/auth/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			username: API_USER,
			password: API_PASSWORD,
			deviceinfo: API_DEVICE
		})
	});
	if (response.status !== 200) {
		throw new Error('Failed to login');
	}
	return (await response.json()).token;
};

const validateToken = async (token) => {
	const response = await fetch(`${ENDPOINT_API}/auth/me`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `${token}`
		}
	});
	return response.status === 200;
};

export const ssr = false;

export const load = async ({ cookies, depends, fetch }) => {
	depends('app:main');

	let token = cookies.get('Authorization');

	if (!token || !(await validateToken(token))) {
		token = `Bearer ${await login(fetch)}`;
		cookies.set('Authorization', `Bearer ${token}`, { path: '/' });
	}

	const client = await redisClientInit();
	const articulos: Article[] = JSON.parse(await client.get('articulos'));
	client.disconnect();
	return { token, articulos };
};
