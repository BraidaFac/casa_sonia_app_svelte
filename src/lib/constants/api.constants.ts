/**
 * Constantes de configuración de API
 */
export const API_ENDPOINTS = {
	BASE_URL: 'https://casasonia.procomisp.com.ar/v5',
	AUTH: {
		LOGIN: '/auth/login',
		ME: '/auth/me'
	},
	PRODUCTOS: '/productos',
	STOCK: '/stock'
} as const;

export const WAREHOUSE_CODES = {
	RUTA: '003',
	CENTRO: '002',
	QUIVER: '004'
} as const;

export const WAREHOUSE_NAMES = {
	[WAREHOUSE_CODES.RUTA]: 'RUTA',
	[WAREHOUSE_CODES.CENTRO]: 'CENTRO',
	[WAREHOUSE_CODES.QUIVER]: 'QUIVER'
} as const;

export const EXCLUDED_BRANDS = ['CASA SONIA LETRAS', 'ADMINISTRACION VARIOS'] as const;

export const EXCLUDED_CATEGORIES = ['Z ARTICULOS INACTIVOS'] as const;

export const REQUEST_TIMEOUT = 1000000;
export const STOCK_LIMIT = 5000000;
