import { ScannerService } from '$lib/services/scanner.service';
import type { ScannerComponents } from '$lib/types/article.types';

/**
 * @deprecated Use ScannerService.initializeScanner instead
 * Esta función se mantiene por compatibilidad pero se recomienda usar el nuevo servicio
 */
export async function initScanner(): Promise<ScannerComponents | undefined> {
	console.warn('initScanner is deprecated. Use ScannerService.initializeScanner instead.');
	const result = await ScannerService.initializeScanner();
	return result || undefined;
}
