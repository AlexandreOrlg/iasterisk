export interface Prompt {
  id: string
  name: string
  content: string
  shortcut: string[]
}
export interface ModelConfig {
  provider: 'openai' | 'mistral' | 'ollama'
  apiKey: string
  model: string
}

export interface PersistentStoreData {
  language: 'fr-fr' | 'en'
  prompts: Prompt[]
  modelConfig: ModelConfig
  showCorrectionWindow: boolean
}
