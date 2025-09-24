import { redisClientClose, redisClientInit } from './redis';

/**
 * Helpers para Redis v5.8.2 - Funciones optimizadas
 */

// Obtener datos con manejo de errores
export const getRedisData = async (key: string) => {
	let client;
	try {
		client = await redisClientInit();
		const data = await client.get(key);
		return data ? JSON.parse(data) : null;
	} catch (error) {
		return null;
	} finally {
		if (client) {
			await redisClientClose(client);
		}
	}
};

// Establecer datos con TTL
export const setRedisData = async (key: string, data: any, ttlSeconds = 3600) => {
	let client;
	try {
		client = await redisClientInit();
		// setEx es más eficiente en Redis v5+
		await client.setEx(key, ttlSeconds, JSON.stringify(data));
		return true;
	} catch (error) {
		console.error(`Error guardando datos en Redis para key "${key}":`, error);
		return false;
	} finally {
		if (client) {
			await redisClientClose(client);
		}
	}
};

// Eliminar una key
export const deleteRedisData = async (key: string) => {
	let client;
	try {
		client = await redisClientInit();
		const result = await client.del(key);
		return result > 0;
	} catch (error) {
		console.error(`Error eliminando datos de Redis para key "${key}":`, error);
		return false;
	} finally {
		if (client) {
			await redisClientClose(client);
		}
	}
};

// Verificar si una key existe
export const existsRedisKey = async (key: string) => {
	let client;
	try {
		client = await redisClientInit();
		const exists = await client.exists(key);
		return exists === 1;
	} catch (error) {
		console.error(`Error verificando existencia de key "${key}":`, error);
		return false;
	} finally {
		if (client) {
			await redisClientClose(client);
		}
	}
};

// Obtener TTL de una key
export const getRedisKeyTTL = async (key: string) => {
	let client;
	try {
		client = await redisClientInit();
		const ttl = await client.ttl(key);
		return ttl;
	} catch (error) {
		console.error(`Error obteniendo TTL para key "${key}":`, error);
		return -1;
	} finally {
		if (client) {
			await redisClientClose(client);
		}
	}
};

// Incrementar un contador
export const incrementRedisCounter = async (key: string, incrementBy = 1) => {
	let client;
	try {
		client = await redisClientInit();
		const newValue = await client.incrBy(key, incrementBy);
		return newValue;
	} catch (error) {
		console.error(`Error incrementando contador "${key}":`, error);
		return null;
	} finally {
		if (client) {
			await redisClientClose(client);
		}
	}
};
