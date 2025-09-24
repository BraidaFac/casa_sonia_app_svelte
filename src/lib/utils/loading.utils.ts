import { LOADING_CONFIG } from '$lib/constants/scanner.constants';

/**
 * Utilidades para manejo de estados de carga
 */
export class LoadingUtils {
	private static intervals = new Map<string, NodeJS.Timeout>();

	/**
	 * Inicia un progreso de carga con incrementos automáticos
	 */
	static startProgressInterval(
		key: string,
		updateCallback: (value: number) => void,
		initialValue: number = LOADING_CONFIG.INITIAL_VALUE
	): void {
		this.clearInterval(key);

		let currentValue = initialValue;
		updateCallback(currentValue);

		const interval = setInterval(() => {
			currentValue += LOADING_CONFIG.INCREMENT;
			updateCallback(currentValue);
		}, LOADING_CONFIG.INTERVAL_MS);

		this.intervals.set(key, interval);
	}

	/**
	 * Detiene un progreso de carga específico
	 */
	static stopProgressInterval(key: string, updateCallback?: (value: number) => void): void {
		this.clearInterval(key);

		if (updateCallback) {
			updateCallback(LOADING_CONFIG.INITIAL_VALUE);
		}
	}

	/**
	 * Limpia un intervalo específico
	 */
	private static clearInterval(key: string): void {
		const interval = this.intervals.get(key);
		if (interval) {
			clearInterval(interval);
			this.intervals.delete(key);
		}
	}

	/**
	 * Limpia todos los intervalos activos
	 */
	static clearAllIntervals(): void {
		this.intervals.forEach((interval) => clearInterval(interval));
		this.intervals.clear();
	}
}
