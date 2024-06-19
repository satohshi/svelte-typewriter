<script lang="ts">
	import { tick } from 'svelte'

	type Props = {
		texts: string[] // Array of strings to be displayed
		repeat?: number // Set to 0 for infinite loop.
		typeSpeed?: number // How fast the text is typed (in ms/char)
		deleteSpeed?: number // How fast the text is deleted (in ms/char)
		blinkDuration?: number // How long the pipe is displayed each "blink" (in ms)
		blinkCount?: number // How many times the pipe is displayed after the text is typed
		ontypestart?: (index: number) => void // allback whenever the text animation starts. `index` of current `text` in `texts` is passed as paramater to the callback function.
		ontypeend?: (index: number) => void // Callback whenever the text animation ends. `index` of current `text` in `texts` is passed as paramater to the callback function.
		ondeletestart?: (index: number) => void // Callback whenever the text deletion starts. `index` of current `text` in `texts` is passed as paramater to the callback function.
		ondeleteend?: (index: number) => void // Callback whenever the text has been deleted. `index` of current `text` in `texts` is passed as paramater to the callback function.
	} & (
		| {
				waitBetweenTexts?: number // How long to wait before starting to type the next text (in ms)
				blinksBetweenTexts?: never
		  }
		| {
				waitBetweenTexts?: never
				blinksBetweenTexts: number // How many times the pipe is displayed between texts
		  }
	)

	let {
		texts,
		repeat = 0,
		typeSpeed = 60,
		deleteSpeed = 40,
		blinkDuration = 600,
		blinkCount = 3,
		waitBetweenTexts = 150,
		blinksBetweenTexts,
		ontypestart,
		ontypeend,
		ondeletestart,
		ondeleteend,
	}: Props = $props()

	let caret: HTMLSpanElement
	let blinking = $state(false)
	let iteration = $state(blinkCount - 0.5)
	let textDisplayed = $state(' ')

	let timeout: ReturnType<typeof setTimeout>

	$effect(() => {
		typewriter(texts, repeat)
		return () => clearTimeout(timeout)
	})

	const sleep = (ms: number) => {
		return new Promise((resolve) => {
			timeout = setTimeout(resolve, ms)
		})
	}

	const blink = async () => {
		blinking = true
		await tick()
		await Promise.allSettled(caret.getAnimations().map((a) => a.finished))
		blinking = false
	}

	async function typewriter(textArr: string[], iterations: number) {
		if (!textArr.length) return

		for (let i = 0; iterations === 0 || i < iterations; i++) {
			for (let j = 0; j < textArr.length; j++) {
				const text = textArr[j]

				// Callback
				ontypestart?.(j)
				// Type text
				for (let k = 0; k <= text.length; k++) {
					textDisplayed = text.slice(0, k)
					await sleep(typeSpeed)
				}

				// Callback
				ontypeend?.(j)

				// Blink for specified duration
				await blink()

				// Callback
				ondeletestart?.(j)

				// Delete text
				for (let k = 0; k <= text.length; k++) {
					textDisplayed = text.slice(0, text.length - k)
					await sleep(deleteSpeed)
				}

				// Callback
				ondeleteend?.(j)

				if (!blinksBetweenTexts) {
					await sleep(waitBetweenTexts)
				} else {
					iteration = blinksBetweenTexts
					await blink()
					iteration = blinkCount - 0.5
				}
			}
		}
	}
</script>

<span
	>{textDisplayed}<span
		bind:this={caret}
		class:blinking
		style="--blink-duration: {blinkDuration}ms; --blink-count: {iteration};">|</span
	></span
>

<style>
	.blinking {
		animation: blink var(--blink-duration) step-start calc(var(--blink-duration) / 4)
			var(--blink-count);
	}

	@keyframes blink {
		0% {
			opacity: 1;
		}
		50% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
</style>
