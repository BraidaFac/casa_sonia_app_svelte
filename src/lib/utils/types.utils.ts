export type Article = {
	ID_ARTICULO?: string | null;
	CODIGO_PRODUCTO?: string | null;
	NOMBRE?: string | null;
	DESCRIPCIONGRUPOSUPERRUBRO?: string | null;
	DESCRIPCIONSUPERRUBRO?: string | null;
	DESCRIPCIONRUBRO?: string | null;
	DESCRIPCION_MARCA?: string | null;
	TALLES?: string | null;
	STOCKTOTAL?: number | null;
	PRECIOVENTA?: number | null;
	ACTIVO?: number | null;
	searchTerms?: string | null;
	stocks?: {
		[key: string]: [] | null;
	} | null;
	PRECIOEFECTIVO?: number | null;
};
