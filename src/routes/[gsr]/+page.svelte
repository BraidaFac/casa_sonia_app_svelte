<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	const { super_categories } = data;
	const { group_category } = data;
</script>

<div class="px-2 relative mt-0 mb-10">
	<a  class="btn btn-sm variant-ghost-error fixed z-30"href="./">Volver</a>
</div>
<div class="table-container p-2">
	<!-- Native Table Element -->
	<table class="table table-hover">
		<thead>
			<tr>
				<th>Rubro</th>
			</tr>
		</thead>
		<tbody>
			{#each super_categories as sc (sc.id)}

				<tr>
					<a href="/{group_category.name}/{sc.id}">
					<td>{sc.name}</td></a>
			{/each}
		</tbody>
	</table>
</div>



