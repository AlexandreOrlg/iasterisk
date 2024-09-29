<script lang="ts">
  import { Button } from '../lib/button'
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
  } from '../lib/card'
  import { Input } from '../lib/input'
  import { Label } from '../lib/label'
  import { RadioGroup, RadioGroupItem } from '../lib/radio-group'
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../lib/select'
  import { providersData } from '../parts/settings/ModelSelection.svelte'
  import { persistentStore } from '../stores/persistentStore'
  import type { ModelConfig } from '../../../../type'
  import { createEventDispatcher } from 'svelte'
  import * as m from '../../../../paraglide/messages'

  const dispatch = createEventDispatcher()

  let step = 1
  let formData = {
    provider: 'openai',
    model: { label: 'GPT-4o Mini', value: 'gpt-4o-mini' },
    apiKey: ''
  }

  const providerList = providersData.map((provider) => ({
    label: provider.label,
    value: provider.value,
    disabled: provider.disabled
  }))

  $: modelsList =
    providersData.find((provider) => provider.value === formData.provider)?.models || []

  $: isNextDisabled =
    (step === 1 && !formData.provider) ||
    (step === 2 && !formData.model) ||
    (step === 3 && !formData.apiKey)

  const handleNext = (): void => {
    if (step < 3) step += 1
  }

  const handlePrevious = (): void => {
    if (step > 1) step -= 1
  }

  const handleSubmit = (): void => {
    persistentStore.setModelConfig({
      ...formData,
      model: formData.model.value
    } as ModelConfig)

    dispatch('complete')
  }
</script>

<div class="flex items-center justify-center min-h-screen bg-gray-100">
  <Card class="w-full max-w-md bg-white">
    <CardHeader>
      <CardTitle>{m.spellcheck_ai_onboarding()}</CardTitle>
      <CardDescription>{m.setup_ai_spellcheck()}</CardDescription>
    </CardHeader>
    <CardContent>
      <form on:submit={handleSubmit}>
        <div class="space-y-4">
          {#if step === 1}
            <div>
              <Label for="ai-provider">{m.ai_provider()}</Label>
              <RadioGroup
                id="ai-provider"
                bind:value={formData.provider}
                class="grid grid-cols-2 gap-4 mt-2"
              >
                {#each providerList as provider}
                  <div>
                    <RadioGroupItem
                      value={provider.value}
                      id={provider.value}
                      class="peer sr-only"
                      disabled={provider.disabled}
                    />

                    <Label
                      for={provider.value}
                      class="flex items-center justify-between rounded-md border-2 border-neutral-200 px-4 h-16 hover:bg-blue-100 hover:text-blue-500 peer-data-[state=checked]:bg-blue-50 peer-data-[state=checked]:border-blue-500 [&:has([data-state=checked])]:border-blue-500"
                    >
                      {provider.label}
                      {#if provider.disabled}
                        <div class="text-xs bg-slate-100 rounded px-2 py-1">{m.soon()}</div>
                      {/if}
                    </Label>
                  </div>
                {/each}
              </RadioGroup>
            </div>
          {/if}
          {#if step === 2}
            <div>
              <Label for="ai-model">{m.ai_model()}</Label>
              <Select bind:selected={formData.model}>
                <SelectTrigger id="ai-model">
                  <SelectValue placeholder={m.select_ai_model()} />
                </SelectTrigger>
                <SelectContent>
                  {#each modelsList as model}
                    <SelectItem value={model.value}>{model.label}</SelectItem>
                  {/each}
                </SelectContent>
              </Select>
            </div>
          {/if}
          {#if step === 3}
            <div>
              <Label for="api-key">{m.api_key()}</Label>
              <Input
                id="api-key"
                type="password"
                placeholder={m.enter_api_key()}
                bind:value={formData.apiKey}
              />
            </div>
          {/if}
        </div>
      </form>
    </CardContent>
    <CardFooter class="flex justify-between">
      <div>
        {#if step > 1}
          <Button variant="secondary" on:click={handlePrevious}>{m.previous()}</Button>
        {/if}
      </div>
      <div class="flex items-center space-x-2">
        <span class="text-sm text-gray-500">
          {m.step_of_total(step, 3)}
        </span>
        {#if step < 3}
          <Button on:click={handleNext} disabled={isNextDisabled}>{m.next()}</Button>
        {:else}
          <Button type="submit" on:click={handleSubmit} disabled={isNextDisabled}
            >{m.finish()}</Button
          >
        {/if}
      </div>
    </CardFooter>
  </Card>
</div>
