/**
 * Constantes de configuración del scanner
 */
export const SCANNER_CONFIG = {
	LIBRARY_LOCATION: 'https://unpkg.com/scandit-web-datacapture-barcode@6.28/build/engine',
	PROGRESS_MESSAGE: 'Loading ...',
	ELEMENT_ID: 'data-capture-view'
} as const;

export const LOADING_CONFIG = {
	INITIAL_VALUE: 0,
	INCREMENT: 3,
	INTERVAL_MS: 500
} as const;
