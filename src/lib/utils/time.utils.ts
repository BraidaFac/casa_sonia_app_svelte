/**
 * Utilidades para manejo de tiempo y delays
 */

/**
 * Pausa la ejecución por el tiempo especificado
 * @param ms Tiempo en milisegundos
 * @returns Promise que se resuelve después del tiempo especificado
 */
export function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Pausa la ejecución por el tiempo especificado (alias más descriptivo)
 * @param ms Tiempo en milisegundos
 * @returns Promise que se resuelve después del tiempo especificado
 */
export const delay = sleep;

/**
 * Pausa la ejecución por segundos
 * @param seconds Tiempo en segundos
 * @returns Promise que se resuelve después del tiempo especificado
 */
export function sleepSeconds(seconds: number): Promise<void> {
	return sleep(seconds * 1000);
}
