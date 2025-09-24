import { PUBLIC_SCANDIT_KEY } from '$env/static/public';
import { SCANNER_CONFIG } from '$lib/constants/scanner.constants';
import type { ScannerComponents } from '$lib/types/article.types';
import * as SDCBarcode from 'scandit-web-datacapture-barcode';
import { barcodeCaptureLoader } from 'scandit-web-datacapture-barcode';
import * as SDCCore from 'scandit-web-datacapture-core';

/**
 * Servicio para manejo del scanner de códigos de barras
 */
export class ScannerService {
	/**
	 * Inicializa el scanner con configuración por defecto
	 */
	static async initializeScanner(): Promise<ScannerComponents | null> {
		try {
			const view = await this.createDataCaptureView();
			const camera = await this.setupCamera();

			if (!camera) {
				return null;
			}

			const context = await this.createDataCaptureContext(camera);
			await view.setContext(context);

			const barcodeCapture = await this.createBarcodeCapture(context);

			return { view, barcodeCapture, camera };
		} catch (error) {
			console.error('Error inicializando scanner:', error);
			return null;
		}
	}

	/**
	 * Crea y configura la vista de captura de datos
	 */
	private static async createDataCaptureView(): Promise<any> {
		const view = new SDCCore.DataCaptureView();
		const element = document.getElementById(SCANNER_CONFIG.ELEMENT_ID);

		if (!element) {
			throw new Error(`Elemento ${SCANNER_CONFIG.ELEMENT_ID} no encontrado`);
		}

		view.connectToElement(element);
		view.showProgressBar();
		view.setProgressBarMessage(SCANNER_CONFIG.PROGRESS_MESSAGE);

		await this.configureScanditCore();

		view.hideProgressBar();
		return view;
	}

	/**
	 * Configura el núcleo de Scandit
	 */
	private static async configureScanditCore(): Promise<void> {
		await SDCCore.configure({
			licenseKey: PUBLIC_SCANDIT_KEY,
			libraryLocation: SCANNER_CONFIG.LIBRARY_LOCATION,
			moduleLoaders: [barcodeCaptureLoader()]
		});
	}

	/**
	 * Configura la cámara
	 */
	private static async setupCamera(): Promise<any | null> {
		const camera = SDCCore.Camera.default;

		if (!camera) {
			return null;
		}

		const cameraSettings = SDCBarcode.BarcodeCapture.recommendedCameraSettings;
		await camera.applySettings(cameraSettings);
		await camera.switchToDesiredState(SDCCore.FrameSourceState.Off);

		return camera;
	}

	/**
	 * Crea el contexto de captura de datos
	 */
	private static async createDataCaptureContext(camera: any): Promise<any> {
		const context = await SDCCore.DataCaptureContext.create();
		await context.setFrameSource(camera);
		return context;
	}

	/**
	 * Crea la captura de códigos de barras
	 */
	private static async createBarcodeCapture(context: any): Promise<any> {
		const settings = new SDCBarcode.BarcodeCaptureSettings();
		settings.enableSymbologies([SDCBarcode.Symbology.Code128]);

		const barcodeCapture = await SDCBarcode.BarcodeCapture.forContext(context, settings);

		barcodeCapture.feedback.success = new SDCCore.Feedback(
			SDCCore.Vibration.defaultVibration,
			SDCCore.Sound.defaultSound
		);

		return barcodeCapture;
	}

	/**
	 * Extrae el código de barras del resultado escaneado
	 */
	static extractBarcodeFromResult(recognizedBarcodes: any[]): string | null {
		if (!recognizedBarcodes || recognizedBarcodes.length === 0) {
			return null;
		}

		const match = recognizedBarcodes[0]._data.match(/^\w+/);
		return match ? match[0] : null;
	}

	/**
	 * Controla el estado de la cámara
	 */
	static async toggleCameraState(camera: any, turnOn: boolean): Promise<void> {
		const state = turnOn ? SDCCore.FrameSourceState.On : SDCCore.FrameSourceState.Off;

		if (!turnOn) {
			// Apagar rápidamente primero en standby, luego off
			await camera.switchToDesiredState(SDCCore.FrameSourceState.Standby);
		}

		await camera.switchToDesiredState(state);
	}

	/**
	 * Controla la visibilidad del elemento de captura
	 */
	static toggleCaptureElementVisibility(): void {
		const element = document.getElementById(SCANNER_CONFIG.ELEMENT_ID);
		if (element) {
			element.classList.toggle('hidden');
		}
	}
}
