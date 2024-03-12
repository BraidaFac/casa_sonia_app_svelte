<script lang="ts">
	import BurgerBar from '$lib/components/BurgerBar.svelte';
	import CardContainer from '$lib/components/CardContainer.svelte';
	import ProductContainer from '$lib/components/ProductContainer.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
	const { grupo_super_rubros, articulos } = data;
</script>

<CardContainer card_data={grupo_super_rubros} />
<ProductContainer {articulos} />
