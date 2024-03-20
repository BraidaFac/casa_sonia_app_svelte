<script lang="ts">
	import ProductContainer from '$lib/components/ProductContainer.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
	import { articleStore } from '$lib/stores/articles.store';
	import { onDestroy, onMount } from 'svelte';
	import { fetchWithPagination } from '$lib/utils/pagination.utils';
	import type { Article } from '$lib/utils/types.utils';
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	let {  token, articulos} = data;
	let loadingValue=0;
	let loading = false;
	import { initScanner } from '$lib/index';
	import * as SDCCore from 'scandit-web-datacapture-core';
	import { all } from 'axios';
	let showScanner = false;
	let view;
	let barcode;
	let result;
	let camera;
	let allresult;
	let scannerSound;
	let count = 0;
	onMount(async () => {
	if (!articulos){
		loading=true;
		const interval=setInterval(()=>{
				loadingValue=loadingValue+1.6;
			},1000);
		articulos = await fetchWithPagination('articulos', 1000, token);
	const res=  await fetch('/api',{
			method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        articulos
      })
		})
		loading=false;
		clearInterval(interval)
 		 if(res.status !== 200){
			alert('No se cargaron los articulos. Intente nuevamente')
		}	}})
	
	function reproducirSonido() {
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
				count++;
				document.getElementById('data-capture-view').classList.add('hidden');
				const recognizedBarcodes = session.newlyRecognizedBarcodes;
				reproducirSonido();
				allresult = recognizedBarcodes;
				result = recognizedBarcodes[0]._data.match(/^\w+/)[0];
				//asynchronously turn off the camera as quickly as possible.
				await camera.switchToDesiredState(SDCCore.FrameSourceState.Standby);
				await camera.switchToDesiredState(SDCCore.FrameSourceState.Off);
				showScanner = false;
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

{#if articulos && !loading}
	{#key code}
		<ProductContainer {articulos} codeScan={code} />
	{/key}
{:else}
<p class="text-4xl text-center my-5 animate-bounce">Cargando articulos</p>
<div class="z-40 absolute w-full"><ProgressRadial
				value={loadingValue}
				class="mx-auto"
				stroke={20}
				meter="stroke-tertiary-500"
				track="stroke-tertiary-500/30"
			/>
		</div>
<div class="w-full h-full backdrop-blur-sm absolute"></div>
{/if}

<div class="flex justify-center flex-col p-3">
	{#if showScanner}
		<button
			class="btn variant-filled-success mb-3"
			on:click={async () => {
				document.getElementById('data-capture-view').classList.toggle('hidden');
				showScanner = !showScanner;
			}}>Dejar de scannear</button
		>
	{:else}
		<button
			class="btn variant-filled-warning mb-3"
			on:click={async () => {
				await camera.switchToDesiredState(SDCCore.FrameSourceState.On);
				showScanner = !showScanner;
				document.getElementById('data-capture-view').classList.toggle('hidden');
			}}>Scannear</button
		>
	{/if}
	<div class="hidden h-80" id="data-capture-view"></div>
</div>
<audio bind:this={scannerSound} src="/beep.mp3"></audio>
<p>{count}</p>
