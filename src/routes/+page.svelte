<script lang="ts">
	import ProductContainer from '$lib/components/ProductContainer.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
	import { articleStore } from '$lib/stores/articles.store';
	import { onMount } from 'svelte';
	import { fetchWithPagination } from '$lib/utils/pagination.utils';
	import type { Article } from '$lib/utils/types.utils';
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	let {  token, articulos} = data;
	let loadingValue=0;
	let loading = false;
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
		}	 
		
	}
})
</script>

<!-- <CardContainer card_data={grupo_super_rubros} /> -->
{#if articulos && !loading}
	<ProductContainer {articulos} />
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
