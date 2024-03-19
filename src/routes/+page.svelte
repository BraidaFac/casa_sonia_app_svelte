<script lang="ts">
	import ProductContainer from '$lib/components/ProductContainer.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
	import { articleStore } from '$lib/stores/articles.store';
	import { onMount } from 'svelte';
	import { fetchWithPagination } from '$lib/utils/pagination.utils';
	import type { Article } from '$lib/utils/types.utils';
	let {  token, articulos} = data;

	onMount(async () => {
	if (!articulos){
		articulos = await fetchWithPagination('articulos', 1000, token);
		//articleStore.set(articulos);
		const res=  await fetch('/api',{
			method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        articulos
      })
		})
		if(res.status !== 200){
			alert('No se cargaron los articulos. Intente nuevamente')
		}	
		
	}
})
</script>

<!-- <CardContainer card_data={grupo_super_rubros} /> -->
{#if articulos && articulos.length>0}
	<ProductContainer {articulos} />
{:else}
	<div class="flex justify-center"><p class="text-3xl text-gray-400">Cargando articulos</p></div>
{/if}
