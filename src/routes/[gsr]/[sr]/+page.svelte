<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	import { createSearchStore, searchHandler } from '$lib/stores/filter';
	import { onDestroy } from 'svelte';
	const { ordered_products } = data;
	const {categories }	= data;
	const {brandes }	= data;

	//filter
	const searchProducts = ordered_products.map((product) => ({
		...product,
		searchTerms: `${product.brand.name} ${product.description} ${product.category.name}`
	}));
	const searchStore = createSearchStore(searchProducts);
	let filterCategory: string = '';
	let filterBrand: string = '';
	
	const unsubscribe = searchStore.subscribe((model: any) => searchHandler(model));

	onDestroy(() => {
		unsubscribe();
	});

	function filterCat() {
		{
			$searchStore.category = `${filterCategory}`;
		}
	}
	function filterBrandes() {
		{
			$searchStore.brand = `${filterBrand}`;
		}
	}
</script>

<div class="filters flex md:flex-row md:justify-stretch flex-col gap-2 mb-2 md:p-4 p-2 w-full">
	<div class="md:w-1/2 flex flex-row ">
		<select class="select" bind:value={filterCategory} on:change={filterCat} name="category" id="category"> -->
			<option selected value="">Rubro</option>
			{#each categories as cat (cat.id)}
			<option value={cat.name}>{cat.name}</option>
			{/each}
		</select>
		<select class="select" bind:value={filterBrand} on:change={filterBrandes} name="brand" id="brand">
			<option selected value="">Marca</option>
			{#each brandes as brand }
				<option value={brand.name}>{brand.name}</option>
			{/each}
		</select>
	</div>
	<div class="md:w-1/2">
		<input type="search" class="input"placeholder="Buscar" bind:value={$searchStore.search} />
	</div>
</div>

<div class="table-container md:p-4 p-2">
	<!-- Native Table Element -->
	{#if $searchStore.filtered.length === 0}
		<p class="text-xl text-center mt-3">No hay productos</p>
	{:else}
	<table class="table table-hover table-fixed ">
		<thead >
			<tr>
				<th >Descripcion</th>
				<th>Precio</th>
				<th>Talles
				<th>Rubro</th>

			</tr>
		</thead>
		<tbody >
			{#each $searchStore.filtered as prod (prod.id)}
				<tr>
					<td >{prod.description}</td>
					<td>${prod.price}</td>
					<td>{prod.size}</td>
					<td>{prod.category.name}</td>

				</tr>
			{/each}
		</tbody>
	</table>
{/if}
</div>

<style>
.table {
  width: 100%;
}
td:nth-child(1) {
	width: 30% !important
  }
  td:nth-child(2) {
	width: 20% !important
  }td:nth-child(3) {
	width: 20% !important
  }td:nth-child(4) {
	width: 30% !important
  }
  th:nth-child(1) {
	width: 30% !important
  }
  th:nth-child(2) {
	width: 20% !important
  }th:nth-child(3) {
	width: 20% !important
  }th:nth-child(4) {
	width: 30% !important
  }

  td:nth-child(1) {
	white-space: nowrap;
	overflow:auto;
	text-align: left;}
  @media (max-width: 768px) {
	.table thead tr {text-align: left;
}
  .table tbody tr td{
	font-size: small !important;
  }
	
}
</style>