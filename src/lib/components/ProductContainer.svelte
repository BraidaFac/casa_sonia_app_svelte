<script lang="ts">
	import { createSearchStore, searchHandler } from '$lib/stores/filter';
	import { onDestroy } from 'svelte';
	export let articulos;
	let filter = '';
	//filter
	const searchProducts = articulos.map((product) => ({
		...product,
		searchTerms: `${product.DESCRIPCIONMARCA} ${product.DESCRIPCION} ${product.DESCRIPCIONRUBRO}`
	}));

	const searchStore = createSearchStore(searchProducts);

	const unsubscribe = searchStore.subscribe((model: any) => searchHandler(model));

	onDestroy(() => {
		unsubscribe();
	});

	function addThousandSeparator(price: number) {
		return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
	}

	$: {
		if (filter.length > 1) {
			$searchStore.search = filter;
		} else {
			$searchStore.search = undefined;
		}
	}
	$: {
	}
</script>

<div class="md:w-1/2 md:mx-auto px-3">
	<input type="search" class="input" placeholder="Buscar" bind:value={filter} />
</div>
<div class="table-container md:p-4 p-2">
	{#if $searchStore.filtered.length !== 0}
		<table class="table table-hover md:table-fixed">
			<thead>
				<tr>
					<th>Descripcion</th>
					<th>Marca</th>
					<th>Rubro</th>
				</tr>
			</thead>
			<tbody>
				{#each $searchStore.filtered as prod (prod.CODIGOARTICULO)}
					<tr>
						<td>{prod.DESCRIPCION}</td>
						<td>{prod.DESCRIPCIONMARCA}</td>
						<td>{prod.DESCRIPCIONRUBRO}</td>
						<td>{prod.PRECIOVENTA}</td>
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

	td:nth-child(2) {
		font-weight: bold;
	}

	@media (min-width: 768px) {
		td:nth-child(1) {
			width: 30% !important;
			white-space: nowrap;
			overflow: auto;
			text-align: left;
		}
		td:nth-child(2) {
			width: 20% !important;
		}
		td:nth-child(3) {
			width: 20% !important;
		}
		td:nth-child(4) {
			width: 30% !important;
		}
	}
	@media (max-width: 768px) {
		.table thead tr {
			text-align: left;
		}
		.table tbody tr td {
			font-size: small !important;
		}
	}
</style>
