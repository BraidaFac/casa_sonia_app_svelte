<script lang="ts">
	import { Avatar } from "@skeletonlabs/skeleton";
	export let user: any;
	$: action_flag = false;
	
</script>
<div class="burger relative float-right">
	{#if user.rol ==="ADMIN"}
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
			
			<form method="POST" action="/logout"role="none">
			  <button type="submit" class="text-gray-700 block w-full px-4 py-2 text-left text-sm" role="menuitem" tabindex="-1" id="menu-item-3">Sign out</button>
			</form>
		  </div>
		</div>
		{/if}
	  </div>
	{:else}
	<form method="post"> 
		<button class="btn-icon	" type="submit" formaction="/logout">
			<Avatar size="small"initials={user.username[0]} />
		</button>
	</form>
	{/if}
</div>

