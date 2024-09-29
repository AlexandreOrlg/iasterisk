<script lang="ts">
  import { onMount } from 'svelte'

  let diff: Array<[number, string]> = []
  let processedDiff: Array<{ text: string; operation: number; fullReplace: boolean }> = []
  let correctedText = ''

  $: if (diff) processDiff()

  onMount(() => {
    window.electron.ipcRenderer.on('diff-text', (_, text) => {
      diff = text
    })

    window.electron.ipcRenderer.on('correction-complete', (_, text) => {
      correctedText = text
    })
  })

  function processDiff() {
    const wordCorrections: { [key: string]: number } = {}
    processedDiff = []

    diff.forEach(([operation, text]) => {
      const words = text.split(/(\s+)/) // Split by spaces, keeping the spaces

      words.forEach((word) => {
        if (!wordCorrections[word]) {
          wordCorrections[word] = 0
        }
        if (operation !== 0 && word.trim() !== '') {
          wordCorrections[word]++
        }
      })

      words.forEach((word) => {
        const fullReplace = wordCorrections[word] > 1
        processedDiff.push({ text: word, operation, fullReplace })
      })
    })
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && correctedText) {
      window.electron.ipcRenderer.send('apply-correction', correctedText)
      window.close()
    }
  }

  function operationClass(operation: number, fullReplace: boolean): string {
    if (fullReplace) {
      return 'full-replace'
    }
    switch (operation) {
      case 1: // DIFF_INSERT
        return 'insert'
      case -1: // DIFF_DELETE
        return 'delete'
      case 0: // DIFF_EQUAL
        return 'equal'
      default:
        return ''
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />
<div class="h-full w-full bg-white/30 flex flex-col">
  <div class="px-4 py-2 h-full">
    {#each processedDiff as { text, operation, fullReplace }}
      <span class={operationClass(operation, fullReplace)}>{text}</span>
    {/each}
  </div>
  <footer class="px-4 py-2 text-xs text-neutral-600 bg-neutral-50/50 shrink-0 border-t border-neutral-300 text-right">
    Appuyez sur Entrée pour accepter la correction
  </footer>
</div>

<style>
  .insert {
    @apply bg-green-100 mx-[1px] rounded text-green-800;
  }Ò
  .delete {
    @apply bg-red-100 mx-[1px] rounded text-red-800 line-through;
  }
  .equal {
    @apply text-black;
  }
  .full-replace {
    @apply bg-red-100 mx-[2px] text-red-800 line-through;
  }
</style>
