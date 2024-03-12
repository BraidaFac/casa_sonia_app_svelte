export type Article = {
	codigoarticulo: string;
	descripcion: string;
	codigoparticular: string;
	precioventa1: number;
	activo: boolean;
	marca: {
		codigomarca: string;
		descripcion: string;
	};
	rubro: {
		codigorubro: string;
		descripcion: string;
		codigosuperrubro: string;
	};
};

