import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from '$env/static/private';
import { createClient } from 'redis';

export const redisClientInit = async () => {
	const client = createClient({
		password: REDIS_PASSWORD,
		socket: {
			host: REDIS_HOST,
			port: +REDIS_PORT
		}
	});
	client.connect();
	return client;
};
