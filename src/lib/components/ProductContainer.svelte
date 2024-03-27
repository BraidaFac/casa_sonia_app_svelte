<script lang="ts">
	import { createSearchStore, searchHandler } from '$lib/stores/filter';
	import type { Article } from '$lib/utils/types.utils';
	import { onDestroy } from 'svelte';
	export let articulos: Article[];

	export let codeScan: string = '';
	let filter = codeScan;
	//filter

	const searchStore = createSearchStore(articulos);

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

	function truncarACentena(numero) {
		return Math.round(numero / 100) * 100;
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
					<th>Codigo</th>
					<th>Descripcion</th>
					<th>Marca</th>
					<th>Precio Efectivo</th>
					<th>Precio tarjeta</th>
					<th>Talles</th>
				</tr>
			</thead>
			<tbody>
				{#each $searchStore.filtered as prod}
					<tr>
						<td>{prod.CODIGO_PRODUCTO}</td>
						<td>{prod.NOMBRE}</td>
						<td>{prod.DESCRIPCION_MARCA}</td>
						<td>${addThousandSeparator(truncarACentena(+prod.PRECIOEFECTIVO.toFixed(0)))}</td>
						<td>${addThousandSeparator(truncarACentena(+prod.PRECIOVENTA.toFixed(0)))}</td>
						<td>{prod.TALLES}</td>
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
