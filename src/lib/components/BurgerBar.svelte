<script lang="ts">
	import { goto, invalidate } from "$app/navigation";
	import { fetchWithPagination } from "$lib/utils/pagination.utils";
	import { Avatar, ProgressRadial,ProgressBar } from "@skeletonlabs/skeleton";
	import {page} from '$app/stores'

	export let user: any;
	
	$: action_flag = false;
	let loading= false;
	let loadingValue=0;
	async function refreshApi(){
		const token = $page.data.token;
		action_flag = !action_flag;
		loading=true;
		const interval=setInterval(()=>{
				loadingValue=loadingValue+1.6;
			},1000);
		setTimeout(()=>{
		clearInterval(interval)},66000);
	
		const articulos = await fetchWithPagination('articulos', 1000, token);
		//articleStore.set(articulos);
		const res=  await fetch('/api',{
			method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        articulos
      })
		})
		loading=false;
		if(res.status === 200){
			alert('Se actualizo correctamente')
			invalidate('app:main');
			window.location.reload();
		}
		else {
			alert(JSON.stringify(await res.json()));
			alert('No se actualizo correctamente. Intente nuevamente')
		}
	}

	

</script>
<div class="burger relative float-right">
	{#if user && user.rol ==="ADMIN"}
	<div class="relative inline-block text-left">
		<div>
		  <button on:click={() => action_flag = !action_flag}
		  type="button" class="inline-flex w-full justify-center gap-x-1.5 rounded-lg px-3 hover:bg-white hover:text-black py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300" id="menu-button" aria-expanded="true" aria-haspopup="true">
			Acciones
		
		  </button>
		</div>

		{#if action_flag}
		<div class="absolute right-0 z-10 mt-2 w-28 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
		  <div class="py-1" role="none">
			<a href="/admin/excel" on:click={() => action_flag = !action_flag} class="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-1">Excel</a>
			<a href="/admin/pdf" on:click={() => action_flag = !action_flag} class="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-1">PDF</a>
			<a href="/" on:click|preventDefault={refreshApi} class="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-1">Actualizar datos</a>
			<form method="POST" action="/logout"role="none">
			  <button type="submit" class="text-gray-700 block w-full px-4 py-2 text-left text-sm" role="menuitem" tabindex="-1" id="menu-item-3">Sign out</button>
			</form>
		  </div>
		</div>
		{/if}
	  </div>
	{:else}
	<a href="/login">Login</a>
	{/if}
</div>
 
{#if loading}
<div class="z-40 absolute w-full top-1/3 pl-6">
<p class="text-4xl my-5  text-center animate-bounce">Cargando articulos</p><ProgressRadial
				value={loadingValue}
				class="mx-auto"
				stroke={20}
				meter="stroke-tertiary-500"
				track="stroke-tertiary-500/30"
			/></div>
<div class="w-full h-full backdrop-blur-sm absolute"></div>
{/if}