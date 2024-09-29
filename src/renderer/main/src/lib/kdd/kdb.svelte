<script>
  import Key from './key.svelte'
  import { Command, ArrowBigUpDash } from 'lucide-svelte'

  export let keys = []
</script>

<div class="flex gap-1 items-center">
  {#each keys as key}
    {#if key?.toLowerCase() === 'meta' || key?.toLowerCase() === 'control'}
      <Key><Command strokeWidth={2.5} size={14} /></Key>
    {:else if key?.toLowerCase() === 'shift'}
      <Key><ArrowBigUpDash strokeWidth={2.5} size={14} /></Key>
    {:else}
      <Key>{key}</Key>
    {/if}
  {/each}
</div>
