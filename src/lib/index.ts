import * as SDCCore from 'scandit-web-datacapture-core';
import * as SDCBarcode from 'scandit-web-datacapture-barcode';
import { barcodeCaptureLoader } from 'scandit-web-datacapture-barcode';
import { PUBLIC_SCANDIT_KEY } from '$env/static/public';
export async function initScanner() {
	const view = new SDCCore.DataCaptureView();
	const settings = new SDCBarcode.BarcodeCaptureSettings();
	settings.enableSymbologies([SDCBarcode.Symbology.Code128]);
	view.connectToElement(document.getElementById('data-capture-view'));
	view.showProgressBar();
	view.setProgressBarMessage('Loading ...');
	await SDCCore.configure({
		licenseKey: PUBLIC_SCANDIT_KEY,
		libraryLocation: 'https://unpkg.com/scandit-web-datacapture-barcode@6.23/build/engine',
		moduleLoaders: [barcodeCaptureLoader()]
	});
	view.hideProgressBar();
	const cameraSettings = SDCBarcode.BarcodeCapture.recommendedCameraSettings;
	const camera = SDCCore.Camera.default;
	if (camera) {
		await camera.applySettings(cameraSettings);
	} else return undefined;
	const context = await SDCCore.DataCaptureContext.create();
	await view.setContext(context);
	await context.setFrameSource(camera);
	await camera.switchToDesiredState(SDCCore.FrameSourceState.Off);

	const barcodeCapture = await SDCBarcode.BarcodeCapture.forContext(context, settings);

	barcodeCapture.feedback.success = new SDCCore.Feedback(
		SDCCore.Vibration.defaultVibration,
		SDCCore.Sound.defaultSound
	);

	return {
		view,
		barcodeCapture,
		camera
	};
}
