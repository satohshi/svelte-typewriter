<script lang="ts">
	import NumberInputWithSlider from './NumberInputWithSlider.svelte'

	interface Props {
		label: string
		mode: 'blink' | 'wait'
		options: {
			blink: number
			wait: number
		}
	}

	const name = $props.id()
	let { label, mode = $bindable(), options = $bindable() }: Props = $props()
</script>

<div class="space-y-2">
	<div class="font-medium text-gray-600">{label}</div>

	<div class="flex gap-6">
		<label class="flex items-center gap-2">
			<input type="radio" {name} value="wait" class="text-gray-900" bind:group={mode} />
			<span class="text-sm">Wait</span>
		</label>
		<label class="flex items-center gap-2">
			<input type="radio" {name} value="blink" class="text-gray-900" bind:group={mode} />
			<span class="text-sm">Blink</span>
		</label>
	</div>

	{#if mode === 'blink'}
		<NumberInputWithSlider
			bind:value={options.blink}
			min={0.5}
			max={10}
			step={0.5}
			unit={options.blink === 1 ? 'time' : 'times'}
		/>
	{:else}
		<NumberInputWithSlider bind:value={options.wait} min={0} max={1000} step={1} unit="ms" />
	{/if}
</div>
