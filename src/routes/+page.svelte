<script lang="ts">
	import ProductContainer from '$lib/components/ProductContainer.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
	import { articleStore } from '$lib/stores/articles.store';
	import { onDestroy, onMount } from 'svelte';
	import { fetchWithPagination } from '$lib/utils/pagination.utils';
	import type { Article } from '$lib/utils/types.utils';
	let { token, articulos } = data;
	import { initScanner } from '$lib/index';
	import * as SDCCore from 'scandit-web-datacapture-core';
	import { all } from 'axios';
	let showScanner = false;
	let view;
	let barcode;
	let result;
	let camera;
	let allresult;

	function reproducirSonido() {
		var scannerSound = document.getElementById('scannerSound');
		scannerSound.play();
	}
	onMount(async () => {
		const response = await initScanner();
		if (response) {
			view = response.view;
			barcode = response.barcodeCapture;
			camera = response.camera;
		} else {
			alert('No se pudo inicializar el scanner');
		}
		const listener = {
			didScan: async (barcode, session) => {
				const recognizedBarcodes = session.newlyRecognizedBarcodes;
				allresult = recognizedBarcodes;
				result = recognizedBarcodes[0]._data.match(/^\w+/)[0];
				reproducirSonido();
				//await barcode.setEnabled(false);
				// asynchronously turn off the camera as quickly as possible.
				//await barcode.context.frameSource.switchToDesiredState(SDCCore.FrameSourceState.Off);
				//showScanner = false;
				//document.getElementById('data-capture-view').classList.add('hidden');
			}
		};
		barcode.addListener(listener);
		if (articulos && articulos.length === 0) {
			articulos = await fetchWithPagination('articulos', 1000, token);
			//articleStore.set(articulos);
			const res = await fetch('/api', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					articulos
				})
			});
			if (res.status === 200) {
			} else {
				alert('No se cargaron los articulos. Intente nuevamente');
			}
		}
	});

	$: code = result ? result : null;
</script>

<!-- <CardContainer card_data={grupo_super_rubros} /> -->
{#if articulos && articulos.length > 0}
	{#key code}
		<ProductContainer {articulos} codeScan={code} />
	{/key}
{:else}
	<div class="flex justify-center"><p class="text-3xl text-gray-400">Cargando articulos</p></div>
{/if}

<div class="flex justify-center flex-col p-3">
	{#if showScanner}
		<button
			class="btn variant-filled-success mb-3"
			on:click={async () => {
				showScanner = !showScanner;
				document.getElementById('data-capture-view').classList.toggle('hidden');
			}}>Dejar de scannear</button
		>
	{:else}
		<button
			class="btn variant-filled-warning mb-3"
			on:click={async () => {
				showScanner = !showScanner;
				document.getElementById('data-capture-view').classList.toggle('hidden');
			}}>Scannear</button
		>
	{/if}
	<div class="hidden h-80" id="data-capture-view"></div>
</div>
<audio id="scannerSound" src="/beep.mp3" preload="auto"></audio>
