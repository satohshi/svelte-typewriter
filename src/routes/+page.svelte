<script lang="ts">
	import '../app.css'
	import TypeWriter from '$lib/TypeWriter.svelte'
	import CopyButton from './CopyButton.svelte'
	import NumberInput from './NumberInput.svelte'
	import EndStateSelector from './EndStateSelector.svelte'
	import NumberInputWithSlider from './NumberInputWithSlider.svelte'
	import CaretBehaviourControl from './CaretBehaviourControl.svelte'
	import type { ComponentProps } from 'svelte'
	import type { EndState, AfterTyped, AfterDeleted } from '$lib/TypeWriter.svelte'

	const LOREM = ['lorem ipsum', 'dolor sit amet', 'consectetur adipiscing elit'] as const

	type Props = ComponentProps<typeof TypeWriter>

	let repeat = $state(0)
	let endState = $state<EndState>({ text: 'typed', caret: 'blink' })

	let typeSpeed = $state(60)
	let deleteSpeed = $state(40)
	let blinkDuration = $state(600)

	let afterTypedMode = $state<keyof AfterTyped>('blink')
	let afterTypedOptions = $state({ blink: 2.5, wait: 150 })

	let afterDeletedMode = $state<keyof AfterDeleted>('wait')
	let afterDeletedOptions = $state({ blink: 3, wait: 150 })

	const options = $derived.by(() => {
		const baseOptions: Omit<Props, 'texts'> = {
			repeat,
			typeSpeed,
			deleteSpeed,
			blinkDuration,
			afterTyped:
				afterTypedMode === 'blink'
					? { blink: afterTypedOptions.blink }
					: { wait: afterTypedOptions.wait },
			afterDeleted:
				afterDeletedMode === 'blink'
					? { blink: afterDeletedOptions.blink }
					: { wait: afterDeletedOptions.wait },
		}

		return (repeat === 0 ? baseOptions : { ...baseOptions, endState }) as Omit<Props, 'texts'>
	})
</script>

<main
	class="mx-auto mt-4 max-w-3xl space-y-8 rounded-lg border border-gray-100 bg-white p-8 shadow-sm"
>
	<section class="rounded-lg bg-gray-50 p-6 text-center text-4xl">
		{#key JSON.stringify(options)}
			<TypeWriter texts={LOREM} {...options} />
		{/key}
	</section>

	<section class="space-y-2">
		<label for="repeat" class="block text-lg font-semibold text-gray-800">Repeat</label>
		<NumberInput
			id="repeat"
			bind:value={repeat}
			min={0}
			step={1}
			unit={repeat === 0 ? '(indefinitely)' : repeat === 1 ? 'time' : 'times'}
		/>
	</section>

	<section class="space-y-4">
		<h2 class="text-lg font-semibold text-gray-800">End State</h2>
		<div
			class={[
				'grid grid-cols-1 gap-x-12 gap-y-4 md:grid-cols-2',
				repeat === 0 && 'pointer-events-none opacity-60',
			]}
		>
			<EndStateSelector type="text" bind:value={endState.text} />
			<EndStateSelector type="caret" bind:value={endState.caret} />
		</div>
	</section>

	<section class="grid grid-cols-1 gap-x-12 gap-y-4 md:grid-cols-2">
		<section class="flex flex-col gap-4">
			<h2 class="text-lg font-semibold text-gray-800">Speed Controls</h2>
			<NumberInputWithSlider
				label="Type Speed"
				bind:value={typeSpeed}
				min={10}
				max={300}
				unit="ms/char"
				step={1}
			/>
			<NumberInputWithSlider
				label="Delete Speed"
				bind:value={deleteSpeed}
				min={10}
				max={300}
				unit="ms/char"
				step={1}
			/>
			<NumberInputWithSlider
				label="Blink Duration"
				bind:value={blinkDuration}
				min={100}
				max={1000}
				unit="ms"
				step={1}
			/>
		</section>

		<section class="flex flex-col gap-4">
			<h2 class="text-lg font-semibold text-gray-800">Caret Behaviour</h2>
			<CaretBehaviourControl
				label="After Typed"
				bind:mode={afterTypedMode}
				bind:options={afterTypedOptions}
			/>
			<CaretBehaviourControl
				label="After Deleted"
				bind:mode={afterDeletedMode}
				bind:options={afterDeletedOptions}
			/>
		</section>
	</section>

	<CopyButton text={JSON.stringify(options, null, 4)} />
</main>

<footer class="mx-auto flex w-full max-w-3xl justify-end p-2">
	<a
		href="https://github.com/satohshi/svelte-typewriter"
		class="text-xs text-gray-600 transition-colors hover:text-gray-800"
		target="_blank"
		rel="noopener noreferrer"
		aria-label="GitHub repository"
	>
		svelte-typewrite v{__VERSION__}
	</a>
</footer>
