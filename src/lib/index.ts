import * as SDCCore from 'scandit-web-datacapture-core';
import * as SDCBarcode from 'scandit-web-datacapture-barcode';
import { barcodeCaptureLoader } from 'scandit-web-datacapture-barcode';
export async function initScanner() {
	const view = new SDCCore.DataCaptureView();
	const settings = new SDCBarcode.BarcodeCaptureSettings();
	settings.enableSymbologies([SDCBarcode.Symbology.Code128]);
	view.connectToElement(document.getElementById('data-capture-view'));
	view.showProgressBar();
	view.setProgressBarMessage('Loading ...');
	await SDCCore.configure({
		licenseKey:
			'ASwUSSvQD793ByfXqSryjtE6gco/NY/DrFQCWvx5IGkYfUex31g8kRR/0qktUwDHVG7usOwTFt9gT1CbnnBBw4BeeFMDA9Ht2xZLRxo2iv+UE7WqL0Zv1mnOyKhFeueHCXyWo7bcGJEUOjrKmOhGpmRPUPgMUl4+JYEq9eDS7UygjA/IxFRNP4BZlZ/gW/ZWWGA7Zg5lX0NboM2btk4LQskjKfDz/ubn89B87x/YXIK6kKA8Ph3ikwPoboVKLMA4jCElhEU35pa9p7l34OECS/nRWgWfS5D5tx8gDrGXrtIfmzMZaIq8QFIaaeWXfcdzvuDTuo0zToArwBnc3b0+DyXGSdsA6D1JibAI3SYvOKbQ2fZEqC6GlnMDayvv03Bosvv3WW/OTHI5KtB0KhTCNSujHgsi29d8FCGcHZM/bDtNh95+jnQI3xyzOfpchQCl/LJFHyu/TO85DffwsF5zQQLPvNpN3FU+HniYlnySw2GT94xWhFj7Aiu3e0EIQUMUmEK2OXfXNWTNbTM81G/Rf3YSWKgtzi0AtZCmDZnGSIc5ragjTX6oSRwlupiyRnQtG+DNkiBk+YACoC5mLg9yU9Sma1WrGoDUxQNY2XSSHGcnp6Ly4tMd32B+K33v2ycumNuB7W44Idj9PuK4XH5LKdcA7t4zvrGWEd9w5lAMip9LBtg5JIOmpE4zn5SD7tOHkmlGQJF+n9l4oR8UXa2GchfF7mSGdZDG6RRJ+oyikAodz+8+MXa+Jvfgnnh0mq9yGCqH2+PAJdeVcjjlvU/r0UdTf/4CZoRJ',
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
