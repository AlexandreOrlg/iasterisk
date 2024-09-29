import OpenAI from 'openai'
import { AiProvider } from './type'

export class OpenAIProvider implements AiProvider {
  private client: OpenAI

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey })
  }

  async getCorrection(
    systemPrompt: string,
    userText: string,
    callback: (text: string) => void,
    model: string = 'gpt-3.5-turbo'
  ): Promise<string> {
    try {
      const stream = await this.client.chat.completions.create({
        model: model,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          { role: 'user', content: userText }
        ],
        temperature: 0.2,
        stream: true
      })

      console.log('CONFIG : ', {
        model: model,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          { role: 'user', content: userText }
        ],
        temperature: 0.2,
        stream: true
      })

      let result = ''

      for await (const chunk of stream) {
        const chuckData = chunk.choices[0]?.delta?.content || ''
        result += chuckData
        callback(chuckData)
      }

      return result
    } catch (error) {
      console.error('Failed to get correction from OpenAI:', error)
      throw error
    }
  }
}
