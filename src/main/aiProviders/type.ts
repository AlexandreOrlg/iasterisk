export interface AiProvider {
    getCorrection(systemPrompt: string, userText: string, callback: (text: string) => void, model?: string): Promise<string>;
  }