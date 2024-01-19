# Svelte Typewriter

Simple typewriter component for Svelte using runes

![](preview.gif)

## Installation

```shell
npm i -D svelte-typewrite
```

## Usage

```js
<script>
    import { TypeWriter } from 'svelte-typewrite'
</script>

<TypeWriter texts={['lorem ipsum', 'dolor sit amet']} />
```

## Options

| Name | Type | Default value | Description |
| --- | --- | --- | --- |
| texts | `string[]` | `null` | Array of strings to be displayed |
| repeat | `number` | `0` | How many times texts should be looped over (`0` for infinite loop) |
| typeSpeed | `number` | `60` | How fast the text is typed (in ms/char) |
| deleteSpeed | `number` | `40` | How fast the text is deleted (in ms/char) |
| blinkDuration | `number` | `300` | How long the pipe is displayed each "blink" (in ms) |
| blinkCount | `number` | `3` | How many times the pipe is displayed after the text is typed |
| waitBetweenTexts | `number` | `150` | How long to wait before starting to type the next text (in ms) |