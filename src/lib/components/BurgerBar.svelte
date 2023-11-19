<script lang="ts">
	import { ListBox, ListBoxItem, popup, type PopupSettings } from "@skeletonlabs/skeleton";

let comboboxValue: string="-"

const popupCombobox: PopupSettings = {
	event: 'click',
	target: 'popupCombobox',
	placement: 'left-start',
	closeQuery: '.listbox-item'
};
</script>
<div class="burger relative float-right">

<button class="btn variant-filled w-10 justify-center" use:popup={popupCombobox}>
	<span class="capitalize">{comboboxValue ?? 'Trigger'}</span>
	<span>↓</span>
</button>
<div class="card w-14 shadow-xl py-2" data-popup="popupCombobox">
	<ListBox class="w-14 text-black ">
        <form class="mb-0 listbox" method="POST">
                <button formaction="/logout" ><ListBoxItem bind:group={comboboxValue} class="w-14"name="medium" value="books">Salir</ListBoxItem></button>
        </form>
	</ListBox>
	<div class="arrow bg-surface-100-800-token" />
</div>
					
</div>

