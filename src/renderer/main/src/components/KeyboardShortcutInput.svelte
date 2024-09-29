<script lang="ts">
  import { onMount } from 'svelte'
  import Key from '../lib/kdd/key.svelte'
  import { Command, ArrowBigUpDash, X } from 'lucide-svelte'

  export let value: string[] = []
  export let placeholder: string = 'Press keys to set shortcut'
  export let id: string

  let inputElement: HTMLInputElement
  let keys: string[] = value
  let isRecording = false

  const clearShortcut = () => {
    keys = []
    value = []
  }

  const aliases: Record<string, string> = {
    esc: 'escape',
    ins: 'insert',
    del: 'delete',
    up: 'arrowup',
    down: 'arrowdown',
    right: 'arrowright',
    left: 'arrowleft',
    pgup: 'pageup',
    pgdn: 'pagedown',
    break: 'pause',
    scroll: 'scrolllock',
    scrlk: 'scrolllock',
    prtscr: 'printscreen',
    win: 'meta',
    windows: 'meta',
    cmd: 'meta',
    command: 'meta',
    comma: ',',
    period: '.',
    quote: '"',
    singlequote: "'",
    colon: ':',
    semicolon: ';',
    plus: '+',
    minus: '-',
    tilde: '~',
    equal: '=',
    slash: '/'
  }

  const startRecording = (): void => {
    isRecording = true
    keys = []
  }

  const stopRecording = (): void => {
    isRecording = false
    value = keys
  }

  const handleKeyDown = (event: KeyboardEvent): void => {
    if (!isRecording) return
    event.preventDefault()

    const modifiers: string[] = []
    if (event.ctrlKey) modifiers.push('Ctrl')
    if (event.altKey) modifiers.push('Alt')
    if (event.shiftKey) modifiers.push('Shift')
    if (event.metaKey) modifiers.push('Meta')

    let key = event.code
    if (key.startsWith('Key')) {
      key = key.slice(3)
    } else if (key.startsWith('Digit')) {
      key = key.slice(5)
    } else {
      key = aliases[key.toLowerCase()] ?? key
    }

    keys = [...modifiers, key]
  }

  const handleKeyUp = (event: KeyboardEvent): void => {
    if (!isRecording) return
    if (!event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey) {
      stopRecording()
    }
  }

  onMount(() => {
    inputElement.addEventListener('keydown', handleKeyDown)
    inputElement.addEventListener('keyup', handleKeyUp)

    return () => {
      inputElement.removeEventListener('keydown', handleKeyDown)
      inputElement.removeEventListener('keyup', handleKeyUp)
    }
  })
</script>

<div class="relative w-full">
  <input
    {id}
    bind:this={inputElement}
    type="text"
    readonly
    placeholder={keys.length > 0 ? '' : placeholder}
    class="border-input bg-white ring-blue-400 placeholder:text-neutral-400 focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    on:focus={startRecording}
    on:click={startRecording}
  />

  <div class="absolute top-1.5 left-2 flex gap-1">
    {#each keys as key}
      {#if key === 'Meta' || key === 'Control'}
        <Key><Command strokeWidth={2.5} size={14} /></Key>
      {:else if key === 'Shift'}
        <Key><ArrowBigUpDash strokeWidth={2.5} size={14} /></Key>
      {:else}
        <Key>{key}</Key>
      {/if}
    {/each}
  </div>
  {#if keys.length > 0}
    <button
    on:click={clearShortcut}
    class="absolute right-2.5 top-1/2 -translate-y-1/2"
    >
        <X size={16} />
    </button>
  {/if}
</div>
