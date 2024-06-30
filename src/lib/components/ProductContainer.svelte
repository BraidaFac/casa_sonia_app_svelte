<script lang="ts">
	import { gsrStore } from '$lib/stores/articles.store';
	import { createSearchStore, searchHandler, filterStore } from '$lib/stores/filter';
	import type { Article } from '$lib/utils/types.utils';
	import { onDestroy } from 'svelte';
	export let articulos: Article[];
	export let coeficients: {
		name: string;
		value: number;
	}[];

	const coef_3 = coeficients.find((coef) => coef.name === 'coef_3')?.value ?? 1;
	const coef_6 = coeficients.find((coef) => coef.name === 'coef_6')?.value ?? 1;
	const coef_efect = coeficients.find((coef) => coef.name === 'coef_efect')?.value ?? 1;
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
	function orderProducts(products) {
		products.sort(function (a, b) {
			if (a.DESCRIPCION_MARCA > b.DESCRIPCION_MARCA) {
				return 1;
			}
			if (a.DESCRIPCION_MARCA < b.DESCRIPCION_MARCA) {
				return -1;
			}
			if (a.DESCRIPCIONGRUPOSUPERRUBRO > b.DESCRIPCIONGRUPOSUPERRUBRO) {
				return 1;
			}
			if (a.DESCRIPCIONGRUPOSUPERRUBRO < b.DESCRIPCIONGRUPOSUPERRUBRO) {
				return -1;
			}
			if (a.DESCRIPCIONSUPERRUBRO > b.DESCRIPCIONSUPERRUBRO) {
				return 1;
			}
			if (a.DESCRIPCIONSUPERRUBRO < b.DESCRIPCIONSUPERRUBRO) {
				return -1;
			}
			if (a.DESCRIPCIONRUBRO > b.DESCRIPCIONRUBRO) {
				return 1;
			}
			if (a.DESCRIPCIONRUBRO < b.DESCRIPCIONRUBRO) {
				return -1;
			}
			return 0;
		});

		return products;
	}
</script>

<div class="md:w-1/2 md:mx-auto px-3">
	<label class="text-center text-lg mb-3" for="">Ingrese codigo o descripción del articulo</label>
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
		<table class="table table-fixed">
			<thead>
				<tr>
					<th>Descripcion</th>
					<th>Marca</th>
					<th>Precio Efectivo</th>
					<th>3 cuotas de</th>
					<th>6 cuotas de</th>
					<th>Talles</th>
					<th>Rubro</th>
					<th>3 cuotas</th>
					<th>6 cuotas</th>
					<th>Codigo</th>
				</tr>
			</thead>
			<tbody>
				{#each orderProducts($searchStore.filtered) as prod}
					<tr>
						<td>{prod.NOMBRE}</td>
						<td>{prod.DESCRIPCION_MARCA}</td>
						<td>${addThousandSeparator(truncarACentena(+prod.PRECIOVENTA * coef_efect))}</td>
						<td
							>${addThousandSeparator(
								truncarACentena(((+prod.PRECIOVENTA * coef_3) / 3).toFixed(0))
							)}</td
						>
						<td
							>${addThousandSeparator(
								truncarACentena(((+prod.PRECIOVENTA * coef_6) / 6).toFixed(0))
							)}</td
						>
						<td>{prod.TALLES}</td>
						<td>{prod.DESCRIPCIONRUBRO}</td>
						<td
							>${addThousandSeparator(truncarACentena((+prod.PRECIOVENTA * coef_3).toFixed(0)))}</td
						>
						<td
							>${addThousandSeparator(truncarACentena((+prod.PRECIOVENTA * coef_6).toFixed(0)))}</td
						>
						<td>{prod.CODIGO_PRODUCTO}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>

<style>
	.table {
		width: 400%;
	}
	@media (min-width: 768px) {
		.table {
			width: 100%;
		}
	}

	td:nth-child(3),
	td:nth-child(4),
	td:nth-child(5),
	td:nth-child(8),
	td:nth-child(9) {
		font-weight: bold;
	}

	@media (max-width: 768px) {
		td:nth-child(1) {
			width: 10% !important;
			white-space: nowrap;
			overflow: auto;
			text-align: left;
		}
		td:nth-child(2) {
			width: 5% !important;
			white-space: nowrap;
			overflow: auto;
		}
		td:nth-child(3) {
			width: 5% !important;
			white-space: nowrap;
			overflow: auto;
		}
		td:nth-child(4) {
			width: 5% !important;
			white-space: nowrap;
			overflow: auto;
		}
		td:nth-child(5) {
			width: 5% !important;
			white-space: nowrap;
			overflow: auto;
		}
		td:nth-child(6) {
			width: 5% !important;
			white-space: nowrap;
			overflow: auto;
		}
		td:nth-child(7) {
			width: 5% !important;
			white-space: nowrap;
			overflow: auto;
		}
		td:nth-child(8) {
			width: 10% !important;
			white-space: nowrap;
			overflow: auto;
		}
		td:nth-child(9) {
			width: 5% !important;
			white-space: nowrap;
			overflow: auto;
		}
		td:nth-child(10) {
			width: 5% !important;
			white-space: nowrap;
			overflow: auto;
		}

		th:nth-child(1) {
			width: 10% !important;
			white-space: nowrap;
			overflow: auto;
		}
		th:nth-child(2) {
			width: 5% !important;
			white-space: nowrap;
			overflow: auto;
		}
		th:nth-child(3) {
			width: 5% !important;
			white-space: nowrap;
			overflow: auto;
		}
		th:nth-child(4) {
			width: 5% !important;
			white-space: nowrap;
			overflow: auto;
		}
		th:nth-child(5) {
			width: 5% !important;
			white-space: nowrap;
			overflow: auto;
		}

		th:nth-child(6) {
			width: 5% !important;
			white-space: nowrap;
			overflow: auto;
		}
		th:nth-child(7) {
			width: 5% !important;
			white-space: nowrap;
			overflow: auto;
		}
		th:nth-child(8) {
			width: 7% !important;
			white-space: nowrap;
			overflow: auto;
		}
		th:nth-child(9) {
			width: 5% !important;
			white-space: nowrap;
			overflow: auto;
		}
		th:nth-child(10) {
			width: 5% !important;
			white-space: nowrap;
			overflow: auto;
		}
	}

	@media (max-width: 768px) {
		.table thead tr {
			text-align: center;
		}
		.table tbody tr td {
			text-align: center !important;
		}
		.table tbody tr td {
			font-size: small !important;
		}
	}
</style>
