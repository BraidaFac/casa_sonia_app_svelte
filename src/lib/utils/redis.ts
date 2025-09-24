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

	client.on('error', (error) => {
		console.error('Redis Client Error:', error);
	});

	// En Redis v5+, connect() devuelve una Promise
	await client.connect();
	return client;
};

// Función helper para cerrar conexión de forma segura
export const redisClientClose = async (client: any) => {
	if (client && client.isOpen) {
		await client.disconnect();
	}
};
