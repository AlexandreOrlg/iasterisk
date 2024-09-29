import { OpenAIProvider } from '../aiProviders/OpenAIProvider'
import { AiProvider } from '../aiProviders/type'

class AiService {
  private provider: AiProvider
  private model: string

  constructor(
    providerType: 'openai' | 'mistral' | 'ollama',
    config: { apiKey?: string; model?: string }
  ) {
    this.model = config.model || 'gpt-4o-mini' // Default model

    switch (providerType) {
      case 'openai':
        this.provider = new OpenAIProvider(config.apiKey!)
        break
      case 'mistral':
        throw new Error('Mistral provider is not implemented')
      case 'ollama':
        throw new Error('Ollama provider is not implemented')
      default:
        throw new Error('Invalid provider type')
    }
  }

  async getCorrection(
    systemPrompt: string,
    userText: string,
    callback: (text: string) => void
  ): Promise<string> {
    return this.provider.getCorrection(systemPrompt, userText, callback, this.model)
  }

  setModel(model: string): void {
    this.model = model
  }
}

export default AiService
