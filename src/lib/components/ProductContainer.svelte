<script lang="ts">
	import { gsrStore } from '$lib/stores/articles.store';
	import { createSearchStore, searchHandler, filterStore } from '$lib/stores/filter';
	import type { Article } from '$lib/utils/types.utils';
	import { onDestroy } from 'svelte';
	export let articulos: Article[];

	let filter;
	//filter
	filterStore.subscribe((value) => {
		filter = value;
	});
	export const searchStore = createSearchStore(articulos);

	const unsubscribe = searchStore.subscribe((model: any) => searchHandler(model));

	onDestroy(() => {
		unsubscribe();
	});

	function addThousandSeparator(price: number) {
		return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
	}

	$: {
		if (filter.length > 0) {
			$searchStore.search = filter;
			$filterStore = filter;
		} else {
			$searchStore.search = undefined;
			$filterStore = '';
		}
	}

	function truncarACentena(numero) {
		return Math.round(numero / 100) * 100;
	}
</script>

<div class="md:w-1/2 md:mx-auto px-3">
	<label class="text-center text-lg mb-3" for="">Ingrese codigo o descripcion del articulo</label>
	<input type="search" class="input" placeholder="Buscar" bind:value={filter} />
</div>
{#if $searchStore.filtered.length === 0 && filter.length === 0}
	<div class="px-3 mt-5">
		<p class="text-2xl text-center mb-4">Sugerencias</p>
		<ul class="flex flex-col flex-wrap h-32 gap-1">
			{#each $gsrStore as gsr}
				<li class="text-center">
					<a
						href="/"
						on:click|preventDefault={() => {
							$filterStore = gsr.descripcion;
						}}>{gsr.descripcion}</a
					>
				</li>
			{/each}
		</ul>
	</div>
{/if}
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
					<th>Rubro</th>
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
						<td>{prod.DESCRIPCIONRUBRO}</td>
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

	td:nth-child(4),
	td:nth-child(5) {
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
