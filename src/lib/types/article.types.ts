/**
 * Tipos relacionados con artículos
 */
export interface Article extends Record<PropertyKey, unknown> {
	ID_ARTICULO: string;
	CODIGO_PRODUCTO: string;
	NOMBRE: string;
	DESCRIPCIONGRUPOSUPERRUBRO: string;
	DESCRIPCIONSUPERRUBRO: string;
	DESCRIPCIONRUBRO: string;
	DESCRIPCION_MARCA: string;
	TALLES: string;
	STOCKTOTAL: number;
	PRECIOVENTA: number;
	ACTIVO: number;
	searchTerms?: string;
	stocks?: Record<string, any>;
	PRECIOEFECTIVO?: number;
}

export interface StockItem {
	CODIGOARTICULO: string;
	// Agregar otros campos según sea necesario
}

export interface ApiResponse<T> {
	data: T[];
}

export interface ScannerComponents {
	view: any;
	barcodeCapture: any;
	camera: any;
}
