<script lang="ts">
	import BurgerBar from '$lib/components/BurgerBar.svelte';
	import CardContainer from '$lib/components/CardContainer.svelte';
	import ProductContainer from '$lib/components/ProductContainer.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
	const { groups_category, products } = data;
</script>

<CardContainer card_data={groups_category} />
<ProductContainer {products} />
