<script module lang="ts">
	export interface EndState {
		/** Whether to leave the text typed or deleted */
		text: 'typed' | 'deleted'
		/** Whether to leave the caret visible, hidden, or blinking */
		caret: 'visible' | 'hidden' | 'blink'
	}
</script>

<script lang="ts" generics="Texts extends readonly string[], Repeat extends number">
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
		/** Array of strings to be displayed */
		texts: Texts
		/**
		 * How fast the text is typed (in `ms/char`)
		 * @defaultValue 60
		 */
		typeSpeed?: number
		/**
		 * How fast the text is deleted (in `ms/char`)
		 * @defaultValue 40
		 */
		deleteSpeed?: number //
		/**
		 * How long the pipe is displayed each "blink" (in `ms`)
		 * @defaultValue 600
		 */
		blinkDuration?: number
		/**
		 * How many times the pipe is displayed after the text is typed
		 * @defaultValue 3
		 */
		blinkCount?: number
		/** Callback function that runs when typing animation starts. Receives the index of the text being typed */
		ontypestart?: (index: Index) => void
		/** Callback function that runs when typing animation ends. Receives the index of the text that was just typed */
		ontypeend?: (index: Index) => void
		/** Callback function that runs when deleting animation starts. Receives the index of the text being deleted */
		ondeletestart?: (index: Index) => void
		/** Callback function that runs when deleting animation ends. Receives the index of the text that was just deleted */
		ondeleteend?: (index: Index) => void
	} & (
		| {
				/**
				 * How long to wait before starting to type the next text (in `ms`)
				 * @defaultValue 150
				 */
				waitBetweenTexts?: number
				blinksBetweenTexts?: never
		  }
		| {
				waitBetweenTexts?: never
				/**
				 * How many times the pipe is displayed between texts
				 * @defaultValue 0
				 */
				blinksBetweenTexts?: number
		  }
	) &
		({
			/**
			 * Number of times to iterate through the texts. `0` for indefinitely
			 * @defaultValue 0
			 */
			repeat?: Repeat
		} & (0 extends Repeat // When the `repeat` prop isn't passed, `Repeat` is `number`, so we need to do `0 extends Repeat` instead of `Repeat extends 0 | undefined`
			? {
					endState?: never
				}
			: {
					/** Options for the end state of animation */
					endState: EndState
				}))

	let {
		texts,
		repeat,
		endState,
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
		typewriter(texts, repeat ?? 0).catch((e: unknown) => {
			// Ignore abort errors that are thrown by `a.cancel()` below
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

	const handleEnd = (caretOption: EndState['caret']) => {
		if (caretOption === 'blink') {
			blink(Infinity)
		} else {
			caret.style.opacity = caretOption === 'visible' ? '1' : '0'
		}
	}

	async function typewriter(textArr: Texts, iterations: number) {
		if (!textArr.length) return

		for (let i = 0; iterations === 0 || i < iterations; i++) {
			for (let j = 0; j < textArr.length; j++) {
				const isLast = i === iterations - 1 && j === textArr.length - 1
				const text = textArr[j]!

				// Type text
				ontypestart?.(j)
				for (let k = 0; k <= text.length; k++) {
					textDisplayed = text.slice(0, k)
					await sleep(typeSpeed)
				}
				ontypeend?.(j)

				// Finish the last iteration with text typed out
				if (isLast && endState?.text === 'typed') {
					handleEnd(endState.caret)
					return
				}

				// Blink for specified duration
				await blink(blinkCount - 0.5)

				// Delete text
				ondeletestart?.(j)
				for (let k = text.length; k >= 0; k--) {
					textDisplayed = text.slice(0, k)
					await sleep(deleteSpeed)
				}
				ondeleteend?.(j)

				// Finish the last iteration with text deleted
				if (isLast) {
					handleEnd(endState!.caret)
					return
				}

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

<!--
@component
TypeWriter component that types out an array of strings.

```svelte
<TypeWriter texts={['lorem ipsum', 'dolor sit amet']} />
```

[Docs](https://github.com/satohshi/svelte-typewriter/blob/main/README.md)
-->

<span>{textDisplayed}<span bind:this={caret}>|</span></span>
