<script lang="ts">
	import ProductContainer from '$lib/components/ProductContainer.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
	import { onMount } from 'svelte';
	import { fetchWithPagination } from '$lib/utils/pagination.utils';
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import { initScanner } from '$lib/index';
	import * as SDCCore from 'scandit-web-datacapture-core';
	import { loadingStore } from '$lib/stores/loadingStore';
	import { filterStore } from '$lib/stores/filter';
	import { page } from '$app/stores';
	let { token, articulos } = data;
	let { coeficients } = $page.data.coeficients;
	$: {
		articulos = $page.data.articulos;
		coeficients = $page.data.coeficients;
	}
	let loadingValue = 0;
	let loading = false;
	loadingStore.subscribe((value) => {
		loading = value;
		let interval;
		if (loading) {
			loadingValue = 0;
			interval = setInterval(() => (loadingValue = loadingValue + 3), 500);
		} else {
			clearInterval(interval);
		}
	});

	let showScanner = false;
	let view;
	let barcode;
	let result;
	let camera;
	let allresult;
	let flag: boolean = false;
	let interval;
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
				document.getElementById('data-capture-view').classList.add('hidden');
				const recognizedBarcodes = session.newlyRecognizedBarcodes;
				allresult = recognizedBarcodes;
				result = recognizedBarcodes[0]._data.match(/^\w+/)[0];
				filterStore.set(result);
				flag = !flag;
				//asynchronously turn off the camera as quickly as possible.
				await camera.switchToDesiredState(SDCCore.FrameSourceState.Standby);
				await camera.switchToDesiredState(SDCCore.FrameSourceState.Off);
				showScanner = false;
			}
		};
		barcode.addListener(listener);
		if (!articulos) {
			loading = true;
			interval = setInterval(() => {
				loadingValue = loadingValue + 3;
			}, 500);
			articulos = await fetchWithPagination('productos', 1000, token);
			const res = await fetch('/api', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					articulos
				})
			});
			loading = false;
			clearInterval(interval);
			loadingValue = 0;
			if (res.status !== 200) {
				alert('No se cargaron los articulos. Intente nuevamente');
			}
		}
	});
</script>

<div class="flex flex-col gap-10">
	<div class="flex justify-center flex-col h-full p-3 mt-6">
		<div class="hidden fixed top-0" id="data-capture-view"></div>
		{#if showScanner && !loading}
			<button
				class="btn variant-filled-error my-3 mx-auto bottom-0 fixed w-full"
				on:click={async () => {
					await camera.switchToDesiredState(SDCCore.FrameSourceState.Off);
					document.getElementById('data-capture-view').classList.toggle('hidden');
					showScanner = !showScanner;
				}}><span class="icon-[mdi--camera-outline] text-4xl"></span>Dejar de scannear</button
			>
		{:else if !showScanner && !loading}
			<button
				class="btn variant-filled-warning my-3 w-full h-12 mx-auto top-20"
				on:click={async () => {
					await camera.switchToDesiredState(SDCCore.FrameSourceState.On);
					showScanner = !showScanner;
					document.getElementById('data-capture-view').classList.toggle('hidden');
				}}><span class="icon-[mdi--camera-outline] text-4xl"></span>Scanee codigo de barras</button
			>
		{/if}
	</div>
	{#if articulos && !loading}
		{#key articulos || flag || coeficients}
			<ProductContainer {articulos} {coeficients} />
		{/key}
	{:else}
		<p class="text-4xl text-center my-5 animate-bounce z-50 mb-5">Cargando articulos</p>
		<div class="z-40 w-full">
			<ProgressRadial
				value={loadingValue}
				class="mx-auto"
				stroke={20}
				meter="stroke-tertiary-500"
				track="stroke-tertiary-500/30"
			/>
		</div>
		<div class="w-full h-full backdrop-blur-sm absolute"></div>
	{/if}
</div>
