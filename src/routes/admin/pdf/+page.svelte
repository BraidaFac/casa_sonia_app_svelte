<script lang="ts">
	import { submitPDF, loading ,pdfData} from '$lib/utils/excel_methods';
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import * as pdfMake from "pdfmake/build/pdfmake";
	import * as pdfFonts from 'pdfmake/build/vfs_fonts';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

	$: file = '';


	pdfMake.createPdf(docDefinition).download();

</script>

{#if !$loading}
	
	<div class="flex flex-col items-center gap-2 mt-10">
		<h1 class="text-3xl">Cargar PDF</h1>
		<form
			class="flex flex-col gap-3 w-1/2"
			on:submit|preventDefault={async (event) => {
				 await submitPDF(event);
			}}
		>
			<input
				class="input"
				bind:value={file}
				type="file"
				name="file"
				id="file"
				accept=".xlsx, .xls,"
			/>
			<div class="flex flex-row justify-center">
				<button
					class="btn disabled:variant-filled-error variant-filled-tertiary"
					disabled={!file ||
						!(file.split('.').reverse()[0] === 'xlsx' || file.split('.').reverse()[0] === 'xls')}
					type="submit">Agregar</button
				>
			</div>
		</form>
	</div>

	{#if $pdfData.length}
	<p>Se cargo</p>
	{/if}
{:else}
	<div class="mx-auto w-fit">
		<ProgressRadial value={undefined}  stroke={20} meter="stroke-tertiary-500" track="stroke-tertiary-500/30"  />

	</div>
{/if}

<style >
	.table thead th{
		font-size: small;
	}
	.table tbody td{
		font-size: small;
	}
	
</style>
