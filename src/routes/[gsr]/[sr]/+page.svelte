<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	import { createSearchStore, searchHandler } from '$lib/stores/filter';
	import { onDestroy } from 'svelte';
	const { ordered_products } = data;
	const {categories }	= data;

	//filter
	const searchProducts = ordered_products.map((product) => ({
		...product,
		searchTerms: `${product.brand.name} ${product.description} ${product.category.name}`
	}));
	const searchStore = createSearchStore(searchProducts);
	let filterCategory: string = '';
	
	const unsubscribe = searchStore.subscribe((model: any) => searchHandler(model));

	onDestroy(() => {
		unsubscribe();
	});

	function filterCat() {
		{
			$searchStore.category = `${filterCategory}`;
		}
	}
</script>

<div class="filters flex md:flex-row flex-col gap-2 mb-2 md:p-4 p-2">
		<select class="select" bind:value={filterCategory} on:change={filterCat} name="category" id="category">
			<option selected value="">Todos</option>
			{#each categories as cat (cat.id)}
				<option value={cat.name}>{cat.name}</option>
			{/each}
		</select>
		<input type="search" class="input"placeholder="Buscar" bind:value={$searchStore.search} />
</div>

<div class="table-container md:p-4 p-2">
	<!-- Native Table Element -->
	{#if $searchStore.filtered.length === 0}
		<p class="text-xl text-center mt-3">No hay productos</p>
	{:else}
	<table class="table table-hover table-auto ">
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
	width: 20% !important
  }
  td:nth-child(5) {
	width: 10% !important
  }

  
  @media (max-width: 768px) {
	.table thead tr {text-align: center;
}
  .table tbody tr td{
	font-size: small !important;
  }
	td:nth-child(1) {
	white-space: nowrap;
  	overflow: hidden;
  	text-overflow: ellipsis;
	text-align: left;}
td:nth-child(2) {
	white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
	max-width: 6rem ;
  

  }td:nth-child(3) {
	white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
	max-width: 6rem ;
	font-weight: bold;
  }}
</style>