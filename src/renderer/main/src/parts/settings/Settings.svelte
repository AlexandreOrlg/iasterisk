<script lang="ts">
  import * as Select from '../../lib/select'
  import { persistentStore } from '../../stores/persistentStore'
  import ModelSelection from './ModelSelection.svelte'
  import { Button } from '../../lib/button'
  import * as m from '../../../../../paraglide/messages'

  const languages = [
    { value: 'fr-fr', label: m.french() },
    { value: 'en', label: m.english() }
  ]

  let lang: 'fr-fr' | 'en' = $persistentStore.language

  let modelConfig = structuredClone($persistentStore.modelConfig)

  const onSelectedLangChange = (e): void => {
    lang = e.value
  }

  const saveSettings = (): void => {
    persistentStore.setLanguage(lang)
    persistentStore.setModelConfig(modelConfig)
  }

  $: saveEnabled =
    JSON.stringify({ ...$persistentStore.modelConfig, language: $persistentStore.language }) ===
    JSON.stringify({ ...modelConfig, language: lang })
</script>

<div class="w-full border border-zinc-200 rounded-lg bg-white pb-4">
  <div class="p-4 flex justify-start items-center">
    <h2 class="text-xl font-bold">{m.settings()}</h2>
  </div>

  <div class="px-4 flex gap-4 flex-col">
    <ModelSelection bind:modelConfig />

    <div class="w-full">
      <label for="language" class="block text-sm font-medium text-gray-700 mb-1"
        >{m.language()}</label
      >
      <Select.Root
        items={languages}
        selected={languages.find((e) => e.value === lang)}
        onSelectedChange={onSelectedLangChange}
      >
        <Select.Trigger>
          <Select.Value placeholder={m.select_language()} />
        </Select.Trigger>
        <Select.Content>
          {#each languages as lang}
            <Select.Item value={lang.value}>{lang.label}</Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
    </div>

    <Button disabled={saveEnabled} on:click={saveSettings}>{m.save()}</Button>
  </div>
</div>
