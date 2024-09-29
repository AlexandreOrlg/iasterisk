<script lang="ts">
  import { onMount } from 'svelte'
  import Onboarding from './components/Onboarding.svelte'
  import Prompt from './parts/prompt/Prompt.svelte'
  import Settings from './parts/settings/Settings.svelte'
  import { persistentStore } from './stores/persistentStore'
  import icon from './assets/icon.png'
  import * as Tabs from './lib/tabs'
  import * as m from '../../../paraglide/messages'

  let showOnboarding = true

  onMount(() => {
    const onboardingCompleted = localStorage.getItem('onboardingCompleted')
    if (onboardingCompleted) {
      showOnboarding = false
    }
  })

  const handleOnboardingComplete = (): void => {
    localStorage.setItem('onboardingCompleted', 'true')
    showOnboarding = false
  }
</script>

<div
  class="absolute left-0 right-0 top-0 h-9 flex items-center justify-center border-b border-neutral-300"
  style="-webkit-app-region: drag"
>
  <div class=" text-[13px] font-semibold top-2 text-neutral-600">{m.settings()}</div>
</div>
<div class="pt-12 flex bg-[#F5F5F5] flex-col gap-5 items-center py-4 bg-neutral h-screen">
  {#key $persistentStore.language}
    {#if $persistentStore.isReady}
      {#if showOnboarding}
        <Onboarding on:complete={handleOnboardingComplete} />
      {:else}
        <div class=" flex gap-2 items-center">
          <img src={icon} alt={m.icon_alt()} class="h-16 rounded-lg" />
          <div class="flex flex-col">
            <h1 class="text-2xl font-bold">{m.app_name()}</h1>
            <p class="text-sm text-neutral-500">{m.app_description()}</p>
          </div>
        </div>

        <Tabs.Root value="prompt" class="h-full flex flex-col items-center w-full px-8">
          <Tabs.List class="grid grid-cols-2 w-[250px]">
            <Tabs.Trigger value="prompt">{m.my_prompts()}</Tabs.Trigger>
            <Tabs.Trigger value="settings">{m.settings()}</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="prompt" class="h-full w-full">
            <Prompt />
          </Tabs.Content>
          <Tabs.Content value="settings" class="h-full w-full">
            <Settings />
          </Tabs.Content>
        </Tabs.Root>
      {/if}
    {:else}
      <div></div>
    {/if}
  {/key}
</div>
