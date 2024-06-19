# Svelte Typewriter

Typewriter component for Svelte that actually "types" one character at a time instead of just moving the caret at linear speed.

![](preview.gif)

## Installation

```shell
npm i svelte-typewrite
```

## Usage

```js
<script>
    import { TypeWriter } from 'svelte-typewrite'
</script>

<TypeWriter texts={['lorem ipsum', 'dolor sit amet']} />
```

## Options

| Name               | Type                      | Default value | Description                                                                                                       |
| ------------------ | ------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------- |
| texts              | `string[]`                | `undefined`   | Array of strings to be displayed                                                                                  |
| repeat             | `number`                  | `0`           | How many times `texts` should be looped over (`0` for infinite loop)                                              |
| typeSpeed          | `number`                  | `60`          | Speed at which the text is typed (in ms/char)                                                                     |
| deleteSpeed        | `number`                  | `40`          | Speed at which the text is deleted (in ms/char)                                                                   |
| blinkDuration      | `number`                  | `600`         | Duration of each "blink" of caret (in ms)                                                                         |
| blinkCount         | `number`                  | `3`           | Number of blinks after the text is typed                                                                          |
| waitBetweenTexts   | `number`                  | `150`         | How long to wait before starting to type the next text (in ms).<br>Will be ignored if `blinksBetweenTexts > 0`    |
| blinksBetweenTexts | `number`                  | `0`           | How many times the caret should blink before starting to type the next text                                       |
| ontypestart        | `(index: number) => void` | `undefined`   | Callback function that runs when typing animation starts.<br>Receives the index of the text being typed           |
| ontypeend          | `(index: number) => void` | `undefined`   | Callback function that runs when typing animation ends.<br>Receives the index of the text that was just typed     |
| ondeletestart      | `(index: number) => void` | `undefined`   | Callback function that runs when deleting animation starts.<br>Receives the index of the text being deleted       |
| ondeleteend        | `(index: number) => void` | `undefined`   | Callback function that runs when deleting animation ends.<br>Receives the index of the text that was just deleted |
