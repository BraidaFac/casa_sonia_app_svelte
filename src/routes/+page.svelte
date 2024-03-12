<script lang="ts">
	import BurgerBar from '$lib/components/BurgerBar.svelte';
	import CardContainer from '$lib/components/CardContainer.svelte';
	import ProductContainer from '$lib/components/ProductContainer.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
	import { articleStore } from '$lib/stores/articles.store';
	import { browser } from '$app/environment';
	import {Html5QrcodeScanner} from 'html5-qrcode';
	import { onMount } from 'svelte';
	import {loadScript} from '$lib/index';

	const { grupo_super_rubros, articulos,setear } = data;

	if(setear){
		articleStore.set(articulos);
	}
</script>

<!-- <CardContainer card_data={grupo_super_rubros} /> -->
<ProductContainer {articulos} />