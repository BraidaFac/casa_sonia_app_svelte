<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import type { GroupCategory } from '@prisma/client';
	import type { PageData } from './$types';

	export let data: PageData;
	const group_category = data.gsr as GroupCategory;
    console.log('group_category', group_category);
    
</script>

<div class="w-1/2 mx-auto">
    <h1 class="text-2xl">Editar {group_category?.name}</h1>
	<form class="flex flex-col gap-3"
		use:enhance={() => {
			return ({ update, result }) => {
                console.log('result', result);
				if (result.status === 200) {
                    console.log('Grupo actualizado correctamente');
                    
					if (window) {
						alert('Grupo actualizado correctamente');
					}
					goto('/admin/gsr');
				}
			};
		}}
		method="POST"
	>
		<input  class="input"hidden value={group_category?.id} name="id" />
		<input  class="input"type="text" value={group_category?.name} name="name"  />
		<input  class="input"type="text" placeholder="Imagen" value={group_category?.img_src ?? ""} name="src_img" id="url_img" />
		<button class="btn variant-filled-surface w-40" type="submit">Editar</button>
	</form>
</div>