<script lang="ts">
  import * as Table from '../../lib/table'
  import CreateAndEditModal from './CreateAndEditModal.svelte'
  import { persistentStore } from '../../stores/persistentStore'
  import PrompTableRow from './PrompTableRow.svelte'
  import * as m from '../../../../../paraglide/messages'
</script>

<div class="h-full w-full border border-zinc-200 rounded-lg bg-white">
  <div class="p-4 flex justify-between items-center">
    <div class="">
      <h2 class="text-xl font-bold">{m.my_prompts()}</h2>
      <p class="text-sm text-neutral-500">{m.manage_prompts_description()}</p>
    </div>

    <CreateAndEditModal />
  </div>

  <Table.Root>
    <Table.Header>
      <Table.Row>
        <Table.Head class="w-[150px]">{m.title()}</Table.Head>
        <Table.Head>{m.prompt()}</Table.Head>
        <Table.Head>{m.shortcut()}</Table.Head>
        <Table.Head class="text-right">{m.actions()}</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {#each $persistentStore.prompts as prompt}
        <PrompTableRow {prompt} />
      {/each}
    </Table.Body>
  </Table.Root>
</div>
