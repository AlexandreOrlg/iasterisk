<script lang="ts">
  import * as Table from '../../lib/table'
  import * as DropdownMenu from '../../lib/dropdown-menu'
  import Kdb from '../../lib/kdd/kdb.svelte'
  import { EllipsisVertical, FilePenLine, Trash2 } from 'lucide-svelte'
  import CreateAndEditModal from './CreateAndEditModal.svelte'
  import type { Prompt } from '../../../../../type'
  import { persistentStore } from '../../stores/persistentStore'
  import * as m from '../../../../../paraglide/messages'

  export let prompt: Prompt
  let open = false
</script>

<CreateAndEditModal formData={prompt} mode="edit" bind:open />

<Table.Row>
  <Table.Cell class="font-medium w-[100px]">{prompt.name}</Table.Cell>
  <Table.Cell>
    <div class="h-5 truncate w-[400px] overflow-hidden text-neutral-600">{prompt.content}</div>
  </Table.Cell>
  <Table.Cell><Kdb keys={prompt.shortcut} /></Table.Cell>
  <Table.Cell class="text-right">
    <DropdownMenu.Root>
      <DropdownMenu.Trigger class="flex items-center justify-center w-full">
        <EllipsisVertical size={18} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item icon={FilePenLine} on:click={() => (open = true)}
          >{m.modify()}</DropdownMenu.Item
        >
        <DropdownMenu.Separator />
        <DropdownMenu.Item
          variant="danger"
          icon={Trash2}
          on:click={() => persistentStore.deletePrompt(prompt.id)}
        >
          {m.remove()}
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </Table.Cell>
</Table.Row>
