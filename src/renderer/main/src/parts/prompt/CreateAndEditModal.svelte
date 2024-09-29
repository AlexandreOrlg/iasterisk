<script lang="ts">
  import { PlusCircle } from 'lucide-svelte'
  import { Button } from '../../lib/button'
  import * as Dialog from '../../lib/dialog/index'
  import { Label } from '../../lib/label'
  import { Input } from '../../lib/input'
  import KeyboardShortcutInput from '../../components/KeyboardShortcutInput.svelte'
  import { Textarea } from '../../lib/textarea'
  import { generateId } from '../../helpers'
  import { persistentStore } from '../../stores/persistentStore'
  import type { Prompt } from '../../../../../type'
  import * as m from '../../../../../paraglide/messages'

  export let mode: 'create' | 'edit' = 'create'
  export let open = false

  export let formData: Prompt = {
    id: '',
    name: '',
    shortcut: [],
    content: ''
  }

  let originalFormData = JSON.parse(JSON.stringify(formData))

  const handleSubmit = async () => {
    const promptId = mode === 'create' ? generateId('prompt') : formData.id
    const promptData = {
      id: promptId,
      name: formData.name,
      shortcut: formData.shortcut,
      content: formData.content
    }

    await persistentStore.setPrompt(promptId, promptData)

    originalFormData = JSON.parse(JSON.stringify(promptData))
    formData = { id: '', name: '', shortcut: [], content: '' }
    open = false
  }
</script>

<Dialog.Root
  bind:open
  onOpenChange={(e) => {
    console.log(originalFormData)
    if (!e) {
      formData = originalFormData
    }
  }}
>
  {#if mode === 'create'}
    <Dialog.Trigger>
      <Button icon={PlusCircle} iconPosition="left">{m.add_prompt()}</Button>
    </Dialog.Trigger>
  {/if}
  <Dialog.Content class="max-w-[600px]">
    <Dialog.Header>
      <Dialog.Title>{mode === 'create' ? m.create_prompt() : m.edit_prompt()}</Dialog.Title>
      <Dialog.Description>
        {m.prompt_description()}
      </Dialog.Description>
    </Dialog.Header>
    <div class="flex gap-5 py-4">
      <div class="flex w-3/5 gap-2 flex-col">
        <Label for="name">{m.name()}</Label>
        <Input id="name" bind:value={formData.name} class="col-span-3" />
      </div>
      <div class="flex gap-2 flex-col">
        <Label for="shortcut">{m.keyboard_shortcut()}</Label>
        <KeyboardShortcutInput id="shortcut" bind:value={formData.shortcut} />
      </div>
    </div>
    <Textarea bind:value={formData.content} />
    <Dialog.Footer>
      <Button on:click={handleSubmit}>{mode === 'create' ? m.create() : m.update()}</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
