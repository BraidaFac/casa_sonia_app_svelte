<!-- <script lang="ts">
	import { enhance } from "$app/forms";
    import type { PageData } from './$types';
    export let data: PageData;

$: group_categories = data.group_categories;
    </script>
<div class="flex flex-col md:flex-row " >
<div class="md:w-1/2 p-4">
<h2 class="text-2xl mb-3">Agregar un grupo super rubro</h2>
<form method="post" action="?/create"  use:enhance={() => {
    return ({ update, result }) => {
        if (result.status === 200) {
            update();
        }
    };
}} class="flex flex-col gap-3">
    <input class="input" name="name" placeholder="Nombre">
    <input class="input" name="url_img" placeholder="Url de la imagen">
    <button class="btn variant-filled-surface w-40 self-center" type="submit">Agregar</button>
</form>
</div>

<div class="table-container w-1/2">
	<table class="table table-hover">
		<thead>
			<tr>
				<th>Nombre</th>
				<th></th>

			</tr>
		</thead>
		<tbody>
			{#each group_categories as gsr}
				<tr>
					<td>{gsr.name}</td>
                    <td><a href="/admin/gsr/{gsr.id}">Editar</a></td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
</div> -->