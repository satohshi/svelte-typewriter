<script lang="ts" generics="Texts extends readonly string[]">
	type Index = {
		[K in keyof Texts]: number extends K
			? // Text is array
				number
			: // Text is tuple
				K extends `${infer N extends number}`
				? N
				: never
	}[number]

	type Props = {
		texts: Texts // Array of strings to be displayed
		repeat?: number // Set to 0 for infinite loop.
		typeSpeed?: number // How fast the text is typed (in ms/char)
		deleteSpeed?: number // How fast the text is deleted (in ms/char)
		blinkDuration?: number // How long the pipe is displayed each "blink" (in ms)
		blinkCount?: number // How many times the pipe is displayed after the text is typed
		ontypestart?: (index: Index) => void // Callback function that runs when typing animation starts. Receives the index of the text being typed
		ontypeend?: (index: Index) => void // Callback function that runs when typing animation ends. Receives the index of the text that was just typed
		ondeletestart?: (index: Index) => void // Callback function that runs when deleting animation starts. Receives the index of the text being deleted
		ondeleteend?: (index: Index) => void // Callback function that runs when deleting animation ends. Receives the index of the text that was just deleted
	} & (
		| {
				waitBetweenTexts?: number // How long to wait before starting to type the next text (in ms)
				blinksBetweenTexts?: never
		  }
		| {
				waitBetweenTexts?: never
				blinksBetweenTexts?: number // How many times the pipe is displayed between texts
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
	let textDisplayed = $state(' ')
	let timeout: ReturnType<typeof setTimeout>

	$effect(() => {
		typewriter(texts, repeat).catch((e: unknown) => {
			if (e instanceof DOMException && e.name === 'AbortError') return
			console.error(e)
		})
		return () => {
			caret.getAnimations().forEach((a) => a.cancel())
			clearTimeout(timeout)
		}
	})

	const sleep = (ms: number) => {
		return new Promise((resolve) => {
			timeout = setTimeout(resolve, ms)
		})
	}

	const blink = (iterations: number) => {
		return caret.animate([{ opacity: 0 }, { opacity: 1 }, { opacity: 0 }], {
			iterations,
			duration: blinkDuration,
			delay: blinkDuration / 4,
			easing: 'steps(2)',
		}).finished
	}

	async function typewriter(textArr: Texts, iterations: number) {
		if (!textArr.length) return

		for (let i = 0; iterations === 0 || i < iterations; i++) {
			for (let j = 0; j < textArr.length; j++) {
				const text = textArr[j]!

				// Type text
				ontypestart?.(j)
				for (let k = 0; k <= text.length; k++) {
					textDisplayed = text.slice(0, k)
					await sleep(typeSpeed)
				}
				ontypeend?.(j)

				// Blink for specified duration
				await blink(blinkCount - 0.5)

				// Delete text
				ondeletestart?.(j)
				for (let k = 0; k <= text.length; k++) {
					textDisplayed = text.slice(0, text.length - k)
					await sleep(deleteSpeed)
				}
				ondeleteend?.(j)

				// Wait before typing the next text
				if (!blinksBetweenTexts) {
					await sleep(waitBetweenTexts)
				} else {
					await blink(blinksBetweenTexts)
				}
			}
		}
	}
</script>

<span>{textDisplayed}<span bind:this={caret}>|</span></span>
