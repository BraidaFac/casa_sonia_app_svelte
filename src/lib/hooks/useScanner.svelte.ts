import { ScannerService } from '$lib/services/scanner.service';
import { filterStore } from '$lib/stores/filter';
import type { ScannerComponents } from '$lib/types/article.types';
import { NotificationUtils } from '$lib/utils/notification.utils';

/**
 * Hook personalizado para manejo del scanner
 */
export function createScannerHook() {
	let scannerComponents: ScannerComponents | null = $state(null);
	let isScanning = $state(false);
	let isInitialized = $state(false);

	/**
	 * Inicializa el scanner
	 */
	async function initializeScanner(): Promise<boolean> {
		try {
			const components = await ScannerService.initializeScanner();

			if (!components) {
				NotificationUtils.showScannerInitError();
				return false;
			}

			scannerComponents = components;
			setupScannerListener();
			isInitialized = true;

			return true;
		} catch (error) {
			console.error('Error inicializando scanner:', error);
			NotificationUtils.showScannerInitError();
			return false;
		}
	}

	/**
	 * Configura el listener del scanner
	 */
	function setupScannerListener(): void {
		if (!scannerComponents) return;

		const listener = {
			didScan: async (barcode: any, session: any) => {
				await handleScanResult(session.newlyRecognizedBarcodes);
			}
		};

		scannerComponents.barcodeCapture.addListener(listener);
	}

	/**
	 * Maneja el resultado del escaneo
	 */
	async function handleScanResult(recognizedBarcodes: any[]): Promise<void> {
		if (!scannerComponents) return;

		try {
			// Ocultar vista de captura
			ScannerService.toggleCaptureElementVisibility();

			// Extraer código de barras
			const barcodeResult = ScannerService.extractBarcodeFromResult(recognizedBarcodes);

			if (barcodeResult) {
				filterStore.set(barcodeResult);
			}

			// Apagar cámara
			await ScannerService.toggleCameraState(scannerComponents.camera, false);
			isScanning = false;
		} catch (error) {
			console.error('Error procesando resultado del escaneo:', error);
		}
	}

	/**
	 * Inicia el escaneo
	 */
	async function startScanning(): Promise<void> {
		if (!scannerComponents || !isInitialized) return;

		try {
			await ScannerService.toggleCameraState(scannerComponents.camera, true);
			ScannerService.toggleCaptureElementVisibility();
			isScanning = true;
		} catch (error) {
			console.error('Error iniciando escaneo:', error);
		}
	}

	/**
	 * Detiene el escaneo
	 */
	async function stopScanning(): Promise<void> {
		if (!scannerComponents) return;

		try {
			await ScannerService.toggleCameraState(scannerComponents.camera, false);
			ScannerService.toggleCaptureElementVisibility();
			isScanning = false;
		} catch (error) {
			console.error('Error deteniendo escaneo:', error);
		}
	}

	/**
	 * Alterna el estado del escaneo
	 */
	async function toggleScanning(): Promise<void> {
		if (isScanning) {
			await stopScanning();
		} else {
			await startScanning();
		}
	}

	return {
		get isScanning() {
			return isScanning;
		},
		get isInitialized() {
			return isInitialized;
		},
		get scannerComponents() {
			return scannerComponents;
		},
		initializeScanner,
		startScanning,
		stopScanning,
		toggleScanning
	};
}
