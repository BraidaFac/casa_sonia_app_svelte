import { writable } from 'svelte/store';
import * as XLSX from 'xlsx';
export const loading = writable(false);
export const pdfData = writable([[] as unknown as Format[]]);
interface Format {
	CODIGO: string;
	GSR: string;
	SR: string;
	RUBRO: string;
	DESCRIPCION: string;
	TALLES: string;
	PRECIO: string;
	MARCA: string;
}
export async function submit(event: Event) {
	const array_json_data: Array<Format[]> = [];
	if (!event.target) {
		return new Response('No se pudo enviar el formulario', { status: 400 });
	} else {
		const data = new FormData(event.target as HTMLFormElement);
		const file = data.get('file') as File;
		if (!file || file?.name.length == 0) {
			return new Response('No existe archivo', { status: 404 });
		}
		const filename = file.name;
		const extension = filename.substring(filename.lastIndexOf('.')).toUpperCase();
		if (extension == '.XLS' || extension == '.XLSX') {
			const fileReader = new FileReader();
			fileReader.readAsBinaryString(file);
			fileReader.onload = async (event) => {
				const binaryData = event.target?.result;
				const workbook = XLSX.read(binaryData, { type: 'binary' });
				for (const sheet of workbook.SheetNames) {
					const sheet_to_json = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], {
						header: 0
					}) as Format[];
					array_json_data.push(sheet_to_json);
				}
				try {
					loading.set(true);
					await sendGroup(array_json_data);
					await sendSuperGroup(array_json_data);
					await sendCategories(array_json_data);
					await sendBrandes(array_json_data);
					await sendProducts(array_json_data);
					loading.set(false);
					alert('Datos enviados correctamente');
				} catch (error) {
					alert(JSON.stringify(error));
					loading.set(false);
				}
			};
		} else {
			return new Response('Formato incorrecto', { status: 400 });
		}
	}
}

async function sendGroup(sheets: Format[][]) {
	const res = await fetch('/api/excel/group', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(sheets)
	});
	const data = await res.json();

	if (!(res.status === 201)) {
		throw data;
	}
}

async function sendSuperGroup(sheets: Format[][]) {
	const res = await fetch('/api/excel/super', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(sheets)
	});
	const data = await res.json();

	if (!(res.status === 201)) {
		throw data;
	}
}

async function sendCategories(sheets: Format[][]) {
	const res = await fetch('/api/excel/category', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(sheets)
	});
	const data = await res.json();

	if (!(res.status === 201)) {
		throw data;
	}
}
async function sendBrandes(sheets: Format[][]) {
	const res = await fetch('/api/excel/brand', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(sheets)
	});
	const data = await res.json();

	if (!(res.status === 201)) {
		throw data;
	}
}

async function sendProducts(sheets: Format[][]) {
	const res = await fetch('/api/excel/products', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(sheets)
	});
	const data = await res.json();
	console.log(data);

	if (!(res.status === 201)) {
		throw data;
	}
}
