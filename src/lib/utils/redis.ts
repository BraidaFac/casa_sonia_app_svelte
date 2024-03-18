import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from '$env/static/private';
import { createClient } from 'redis';

let cliente;
export const redisClientInit = async () => {
	if (!cliente) {
		const client = createClient({
			password: REDIS_PASSWORD,
			socket: {
				host: REDIS_HOST,
				port: +REDIS_PORT
			}
		});
		cliente = client;
	}
	cliente.connect();
	return cliente;
};
