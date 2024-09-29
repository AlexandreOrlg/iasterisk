import { get, writable } from 'svelte/store'
import type { ModelConfig, PersistentStoreData, Prompt } from '../../../../type'

import { setLanguageTag } from '../../../../paraglide/runtime.js'

export interface PersistentRendererStoreData
  extends Omit<PersistentStoreData, 'showCorrectionWindow'> {
  isReady: boolean
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const createPersistentStore = () => {
  const store = writable<PersistentRendererStoreData>({
    isReady: false,
    language: 'en',
    prompts: [],
    modelConfig: {
      provider: 'openai',
      apiKey: '',
      model: 'gpt-4o-mini'
    }
  })

  const { subscribe, set, update } = store

  const init: () => Promise<void> = async () => {
    const language =
      (await window.electron.ipcRenderer.invoke('getPersistentStoreValue', 'language')) ?? 'en'

    setLanguageTag(language)

    const prompts =
      (await window.electron.ipcRenderer.invoke('getPersistentStoreValue', 'prompts')) ?? []

    const modelConfig = (await window.electron.ipcRenderer.invoke(
      'getPersistentStoreValue',
      'modelConfig'
    )) ?? {
      provider: 'openai',
      apiKey: '',
      model: 'gpt-4o-mini'
    }

    set({ language, prompts, modelConfig, isReady: true })
  }

  init()

  return {
    subscribe,
    setLanguage: (value: 'en' | 'fr-fr'): void => {
      window.electron.ipcRenderer.invoke('setPersistentStoreValue', 'language', value)
      setLanguageTag(value)
      update((data) => ({ ...data, language: value }))
    },
    setModelConfig: (config: Partial<ModelConfig>): void => {
      update((data) => {
        const updatedConfig = { ...data.modelConfig, ...config }
        window.electron.ipcRenderer.invoke('setPersistentStoreValue', 'modelConfig', updatedConfig)
        return { ...data, modelConfig: updatedConfig }
      })
    },
    setPrompt: (id: string, value: Prompt): void => {
      update((data) => {
        // Map through existing prompts and update the one with the matching id
        const updatedPrompts = data.prompts.map((prompt) =>
          prompt.id === id ? { ...prompt, ...value } : prompt
        )
        // If no prompt with the given id exists, add a new one
        if (!updatedPrompts.some((prompt) => prompt.id === id)) {
          updatedPrompts.push({ id, ...value })
        }
        // Persist the updated prompts to the store
        window.electron.ipcRenderer.invoke('setPersistentStoreValue', 'prompts', updatedPrompts)
        return { ...data, prompts: updatedPrompts }
      })
    },
    getPrompt: (id: string): Prompt | null => {
      return get(store).prompts.find((p) => p.id === id)
    },
    deletePrompt: (id: string): void => {
      update((data) => {
        const updatedPrompts = data.prompts.filter((prompt) => prompt.id !== id)
        window.electron.ipcRenderer.invoke('setPersistentStoreValue', 'prompts', updatedPrompts)
        return { ...data, prompts: updatedPrompts }
      })
    },
    init
  }
}

export const persistentStore = createPersistentStore()
