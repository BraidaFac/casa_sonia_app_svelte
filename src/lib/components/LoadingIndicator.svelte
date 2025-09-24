<script lang="ts">
	import { NotificationUtils } from '$lib/utils/notification.utils';
	import { ProgressRadial } from '@skeletonlabs/skeleton';

	interface Props {
		progress: number;
		message?: string;
	}

	let { progress, message = NotificationUtils.getLoadingMessage() }: Props = $props();
</script>

<div class="loading-container">
	<p class="text-4xl text-center my-5 animate-bounce z-50 mb-5">
		{message}
	</p>

	<div class="z-40 w-full">
		<ProgressRadial
			value={progress}
			class="mx-auto"
			stroke={20}
			meter="stroke-tertiary-500"
			track="stroke-tertiary-500/30"
		/>
	</div>

	<div class="w-full h-full backdrop-blur-sm absolute"></div>
</div>

<style>
	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>
