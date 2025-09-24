<script lang="ts">
	import { NotificationUtils } from '$lib/utils/notification.utils';

	interface Props {
		isScanning: boolean;
		isLoading: boolean;
		onToggleScanning: () => Promise<void>;
	}

	let { isScanning, isLoading, onToggleScanning }: Props = $props();

	const buttonConfig = $derived(NotificationUtils.getScannerButtonText(isScanning));

	const buttonClass = $derived(
		() =>
			'btn rounded-2xl w-11/12 p-2  fixed bottom-5 left-1/2 transform -translate-x-1/2 flex gap-5 justify-center items-center z-50 ' +
			(isScanning ? 'bg-red-900 text-white' : 'bg-white text-black')
	);
</script>

{#if !isLoading}
	<button class={buttonClass()} onclick={onToggleScanning} disabled={isLoading}>
		<span class="{buttonConfig.icon} text-4xl"></span>
		{buttonConfig.text}
	</button>
{/if}
