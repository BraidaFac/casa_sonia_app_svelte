import { writable } from 'svelte/store';
import * as XLSX from 'xlsx';
export const loading = writable(false);



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
			fileReader.onload = (event) => {
				const binaryData = event.target?.result;
				const workbook = XLSX.read(binaryData, { type: 'binary' });
				for (const sheet of workbook.SheetNames) {
					const sheet_to_json = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], {
						header: 0
					}) as Format[];
					array_json_data.push(sheet_to_json);
				}

				sendData(array_json_data);
				sendSuperGroup(array_json_data);
			};
		} else {
			return new Response('Formato incorrecto', { status: 400 });
		}
	}
}

async function sendData(sheets: Format[][]) {
	try {
		loading.set(true);

		const res = await fetch('/api/excel/data', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(sheets)
		});
		const data = await res.json();

		if (data.status === 200) {
			alert(JSON.stringify(data));
			loading.set(false);
		} else {
			alert(JSON.stringify(data));
			loading.set(false);
		}
	} catch (error) {
		alert('Error');
	}
}

async function sendSuperGroup(sheets: Format[][]) {
	try {
		loading.set(true);
		const res = await fetch('/api/excel/category', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(sheets)
		});
		const data = await res.json();

		if (data.status === 200) {
			alert(JSON.stringify(data));
			loading.set(false);
		} else {
			alert(JSON.stringify(data));
			loading.set(false);
		}
	} catch (error) {
		alert('Error');
	}
}