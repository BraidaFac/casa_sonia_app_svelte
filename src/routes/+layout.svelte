<script lang="ts">
	import '../app.postcss';
	import {} from '@skeletonlabs/skeleton';
	import type { ModalComponent } from '@skeletonlabs/skeleton';
	import Nav from '../lib/components/Nav.svelte';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import {
		storePopup,
		AppShell,
		getModalStore,
		initializeStores,
		Modal
	} from '@skeletonlabs/skeleton';
	import ModalCoef from '$lib/components/ModalCoef.svelte';
	initializeStores();
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
	const modalRegistry: Record<string, ModalComponent> = {
		modalCoeficiente: { ref: ModalCoef }
	};
	const modalStore = getModalStore();
</script>

<AppShell>
	<Modal components={modalRegistry} />
	<svelte:fragment slot="pageHeader">
		<Nav></Nav>
	</svelte:fragment>
	<slot />
</AppShell>
