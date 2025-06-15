<script lang="ts">
	export let aspectRatio: number = 1;
	export let className: string = '';
	export let minHeight: number = 200; // Minimum height in pixels
	export let maxHeight: number = 600; // Maximum height in pixels
	export let animated: boolean = true;

	// Calculate container aspect ratio for proper sizing
	$: containerStyle = `aspect-ratio: ${aspectRatio}; min-height: ${minHeight}px; max-height: ${maxHeight}px;`;
</script>

<div class="image-placeholder {className}" style={containerStyle} class:animated>
	<div class="placeholder-content">
		<div class="skeleton-loader"></div>
	</div>
</div>

<style>
	.image-placeholder {
		position: relative;
		width: 100%;
		background-color: #f0f0f0;
		border-radius: 4px;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.placeholder-content {
		width: 100%;
		height: 100%;
		position: relative;
	}

	.skeleton-loader {
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
		background-size: 200% 100%;
	}

	.animated .skeleton-loader {
		animation: loading 1.5s infinite;
	}

	@keyframes loading {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
	}

	/* Dark mode support */
	@media (prefers-color-scheme: dark) {
		.image-placeholder {
			background-color: #2a2a2a;
		}

		.skeleton-loader {
			background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%);
		}
	}
</style>
