/**
 * Utilidades para manejo de notificaciones y alertas
 */
export class NotificationUtils {
	/**
	 * Muestra una alerta simple
	 */
	static showAlert(message: string): void {
		alert(message);
	}

	/**
	 * Muestra alerta de error de inicialización del scanner
	 */
	static showScannerInitError(): void {
		this.showAlert('No se pudo inicializar el scanner');
	}

	/**
	 * Muestra alerta de error de carga de artículos
	 */
	static showArticleLoadError(): void {
		this.showAlert('No se cargaron los articulos. Intente nuevamente');
	}

	/**
	 * Muestra mensaje de carga
	 */
	static getLoadingMessage(): string {
		return 'Cargando articulos';
	}

	/**
	 * Obtiene texto para botones del scanner
	 */
	static getScannerButtonText(isScanning: boolean): {
		text: string;
		icon: string;
	} {
		return isScanning
			? { text: 'Dejar de scannear', icon: 'icon-[mdi--camera-outline]' }
			: { text: 'Scanee codigo de barras', icon: 'icon-[mdi--camera-outline]' };
	}
}
