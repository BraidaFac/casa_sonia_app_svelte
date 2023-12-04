<script lang="ts">
	import { enhance } from '$app/forms';
	import * as pdfMake from 'pdfmake/build/pdfmake';
	import * as pdfFonts from 'pdfmake/build/vfs_fonts';
	import { onMount } from 'svelte';

	onMount(() => {
		(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
	});
	function addThousandSeparator(price: number) {
		return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
	}

	const createPDF = (
		data: {
			GSR: string;
			SR: string;
			TALLES: string;
			MARCA: string;
			DESCRIPCION: string;
			PRECIO: string | number;
		}[]
	) => {
		const header = [
			{ text: 'GSR', fillColor: 'grey', fontSize: 10, margin: [0, 2, 0, 2] },
			{ text: 'SR', fillColor: 'grey', fontSize: 10, margin: [0, 2, 0, 2] },
			{ text: 'DESCRIPCION', fillColor: 'grey', fontSize: 10, margin: [0, 2, 0, 2] },
			{ text: 'TALLES', fillColor: 'grey', fontSize: 10, margin: [0, 2, 0, 2] },
			{ text: 'MARCA', fillColor: 'grey', fontSize: 10, margin: [0, 2, 0, 2] },
			{ text: 'PRECIO', fillColor: 'grey', fontSize: 10, margin: [0, 2, 0, 2] }
		];
		const heightArray = Array.from({ length: data.length + 1 }, () => 15);
		const body = [header].concat(
			data.map((prod) => {
				return [
					prod.GSR,
					prod.SR,
					prod.DESCRIPCION,
					prod.TALLES,
					prod.MARCA,
					{ text: `$${addThousandSeparator(Number(prod.PRECIO))}`, bold: true }
				];
			})
		);
		const pdfDefinition = {
			footer: function (currentPage) {
				return [{ text: 'Pagina ' + currentPage.toString(), alignment: 'center' }];
			},
			header: function () {
				return [
					{ text: 'PRECIOS LISTA MARCA', alignment: 'center', margin: [0, 10, 0, 0], fontSize: 15 }
				];
			},
			content: [
				{
					fontSize: 8,
					layout: 'lightHorizontalLines',
					table: {
						heights: [...heightArray],
						headerRows: 1,
						widths: [20, 130, 190, 35, 'auto', 'auto'],
						body: body
					},
					width: '100%'
				}
			]
		};
		pdfMake.createPdf(pdfDefinition).open();

		// .download(`ListaPrecios-${new Date().getFullYear()}-${new Date().getMonth() + 1}.pdf`);
	};
</script>

<div class="flex flex-col items-center gap-2 mt-10">
	<h1 class="text-3xl">PDF</h1>
	<div class="flex flex-row justify-center">
		<form
			method="POST"
			use:enhance={() => {
				return async ({ result }) => {
					createPDF(result.data);
				};
			}}
		>
			<button class="btn disabled:variant-filled-error variant-filled-tertiary" type="submit"
				>GENERAR PDF</button
			>
		</form>
	</div>
</div>
