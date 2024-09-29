<script context="module">
  export const providersData = [
    {
      label: 'OpenAi',
      value: 'openai',
      models: [
        {
          value: 'gpt-4o',
          label: 'GPT-4o',
          pricing: {
            input: 0.005,
            output: 0.015
          }
        },
        {
          value: 'gpt-4o-mini',
          label: 'GPT-4o Mini',
          pricing: {
            input: 0.00015,
            output: 0.0006
          }
        }
      ]
    },
    {
      label: 'Anthropic',
      value: 'anthropic',
      disabled: true,
      models: []
    },
    {
      label: 'Ollama',
      value: 'ollama',
      disabled: true,
      models: []
    }
  ]
</script>

<script lang="ts">
  import { Input } from '../../lib/input'
  import * as Select from '../../lib/select'
  import { EyeIcon, EyeOffIcon } from 'lucide-svelte'
  import type { Selected } from 'bits-ui/dist/shared'
  import type { ModelConfig } from '../../../../../type'
  import * as m from '../../../../../paraglide/messages'

  export let modelConfig: ModelConfig

  const providerList = providersData.map((provider) => ({
    label: provider.label,
    value: provider.value,
    disabled: provider.disabled
  }))

  $: modelsList =
    providersData.find((provider) => provider.value === modelConfig.provider)?.models || []

  $: selectedModel = modelsList.find((e) => e.value === modelConfig.model)

  let showApiKey = false

  const toggleApiKeyVisibility = (): void => {
    showApiKey = !showApiKey
  }
  const onSelectedModelProviderChange = (e: Selected<string>): void => {
    modelConfig.provider = e.value as 'openai' | 'ollama' | 'mistral'
  }
  const onSelectedModelChange = (e: Selected<string>): void => {
    modelConfig.model = e.value
  }
</script>

<div class="flex gap-4">
  <div class="w-[150px] shrink-0">
    <label for="modelType" class="block text-sm font-medium text-gray-700 mb-1"
      >{m.provider()}</label
    >
    <Select.Root
      items={providerList}
      selected={providerList.find((e) => e.value === modelConfig.provider)}
      onSelectedChange={onSelectedModelProviderChange}
    >
      <Select.Trigger>
        <Select.Value class="text-left" placeholder={m.select_model()} />
      </Select.Trigger>
      <Select.Content>
        {#each providerList as type}
          <Select.Item disabled={type.disabled} value={type.value}>{type.label}</Select.Item>
        {/each}
      </Select.Content>
    </Select.Root>
  </div>

  {#if modelConfig.provider === 'openai' && modelsList}
    <div class="w-[150px] shrink-0">
      <label for="modelType" class="block text-sm font-medium text-gray-700 mb-1"
        >{m.model_type()}</label
      >
      <Select.Root
        items={modelsList}
        selected={selectedModel}
        onSelectedChange={onSelectedModelChange}
      >
        <Select.Trigger>
          <Select.Value class="text-left" placeholder={m.select_model()} />
        </Select.Trigger>
        <Select.Content>
          {#each modelsList as model}
            <Select.Item value={model.value}>{model.label}</Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
    </div>
    <div class="w-full relative">
      <label for="apiKey" class="block text-sm font-medium text-gray-700 mb-1">
        {m.enter_api_key()}
      </label>
      <div class="relative">
        <Input
          type={showApiKey ? 'text' : 'password'}
          id="apiKey"
          bind:value={modelConfig.apiKey}
          placeholder={m.your_api_key()}
          class="pr-9"
        />
        <button
          type="button"
          class="absolute inset-y-1 right-1 rounded flex items-center pl-1 pr-2 bg-white h-8"
          on:click={toggleApiKeyVisibility}
        >
          {#if showApiKey}
            <EyeOffIcon class="h-5 w-5 text-neutral-800 " />
          {:else}
            <EyeIcon class="h-5 w-5 text-neutral-800 bg-white" />
          {/if}
        </button>
      </div>
    </div>
  {/if}
</div>
