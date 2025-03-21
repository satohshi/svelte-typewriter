<script lang="ts">
	import BaseNumberInput from './NumberInput.svelte'

	interface Props {
		label?: string
		value: number
		min: number
		max: number
		step: number
		unit: string
	}

	const id = $props.id()

	let { label, value = $bindable(), min, max, unit, step }: Props = $props()
</script>

<div class="space-y-2">
	{#if label}
		<label for={id} class="block font-medium text-gray-600">{label}</label>
	{/if}

	<BaseNumberInput {id} {value} {min} {max} {step} {unit} />

	<input type="range" bind:value {min} {max} {step} class="w-full" />
</div>
