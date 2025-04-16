import axios from 'axios';

export interface LLMConfig {
  id: string;
  name: string;
  apiKey: string;
  baseUrl?: string;
  model: string;
  maxTokens: number;
  temperature: number;
  costPer1kTokens: number;
}

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface CompletionRequest {
  messages: Message[];
  config: LLMConfig;
}

export interface CompletionResponse {
  content: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  cost: number;
}

export class LLMService {
  private static instance: LLMService;
  private configs: Map<string, LLMConfig> = new Map();

  private constructor() {
    this.loadConfigs();
  }

  public static getInstance(): LLMService {
    if (!LLMService.instance) {
      LLMService.instance = new LLMService();
    }
    return LLMService.instance;
  }

  private loadConfigs() {
    const savedConfigs = localStorage.getItem('llmConfigs');
    if (savedConfigs) {
      const configs = JSON.parse(savedConfigs) as LLMConfig[];
      configs.forEach(config => this.configs.set(config.id, config));
    }
  }

  public async getCompletion(request: CompletionRequest): Promise<CompletionResponse> {
    const { config, messages } = request;
    const baseUrl = config.baseUrl || 'https://api.openai.com/v1/chat/completions';

    try {
      const response = await axios.post(
        baseUrl,
        {
          model: config.model,
          messages,
          max_tokens: config.maxTokens,
          temperature: config.temperature,
        },
        {
          headers: {
            'Authorization': `Bearer ${config.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const usage = response.data.usage;
      const cost = (usage.total_tokens / 1000) * config.costPer1kTokens;

      return {
        content: response.data.choices[0].message.content,
        usage,
        cost,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`API Error: ${error.response?.data?.error?.message || error.message}`);
      }
      throw error;
    }
  }

  public async testConnection(config: LLMConfig): Promise<boolean> {
    try {
      await this.getCompletion({
        config,
        messages: [
          {
            role: 'user',
            content: 'Hello, this is a test message. Please respond with "OK".',
          },
        ],
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  public getConfig(id: string): LLMConfig | undefined {
    return this.configs.get(id);
  }

  public getAllConfigs(): LLMConfig[] {
    return Array.from(this.configs.values());
  }

  public updateConfig(config: LLMConfig) {
    this.configs.set(config.id, config);
    this.saveConfigs();
  }

  public deleteConfig(id: string) {
    this.configs.delete(id);
    this.saveConfigs();
  }

  private saveConfigs() {
    localStorage.setItem('llmConfigs', JSON.stringify(this.getAllConfigs()));
  }
}

export const llmService = LLMService.getInstance();