import axios from 'axios';

interface LLMPricing {
  model: string;
  inputPrice: number;  // per 1k tokens
  outputPrice: number; // per 1k tokens
  lastUpdated: Date;
}

export class LLMPricingService {
  private static instance: LLMPricingService;
  private prices: Map<string, LLMPricing> = new Map();
  private lastUpdate: Date | null = null;
  private updateInterval = 24 * 60 * 60 * 1000; // 24 hours

  private constructor() {
    this.loadPrices();
  }

  public static getInstance(): LLMPricingService {
    if (!LLMPricingService.instance) {
      LLMPricingService.instance = new LLMPricingService();
    }
    return LLMPricingService.instance;
  }

  private loadPrices() {
    const savedPrices = localStorage.getItem('llmPrices');
    if (savedPrices) {
      const prices = JSON.parse(savedPrices);
      Object.entries(prices).forEach(([model, pricing]) => {
        this.prices.set(model, {
          ...pricing as LLMPricing,
          lastUpdated: new Date((pricing as LLMPricing).lastUpdated),
        });
      });
    }

    // Set default prices if none exist
    if (this.prices.size === 0) {
      this.setDefaultPrices();
    }
  }

  private setDefaultPrices() {
    const now = new Date();
    const defaultPrices: [string, LLMPricing][] = [
      ['gpt-4', { model: 'gpt-4', inputPrice: 0.03, outputPrice: 0.06, lastUpdated: now }],
      ['gpt-4-32k', { model: 'gpt-4-32k', inputPrice: 0.06, outputPrice: 0.12, lastUpdated: now }],
      ['gpt-3.5-turbo', { model: 'gpt-3.5-turbo', inputPrice: 0.0015, outputPrice: 0.002, lastUpdated: now }],
      ['gpt-3.5-turbo-16k', { model: 'gpt-3.5-turbo-16k', inputPrice: 0.003, outputPrice: 0.004, lastUpdated: now }],
      ['claude-2', { model: 'claude-2', inputPrice: 0.008, outputPrice: 0.024, lastUpdated: now }],
      ['claude-instant-1', { model: 'claude-instant-1', inputPrice: 0.0008, outputPrice: 0.0024, lastUpdated: now }],
    ];

    defaultPrices.forEach(([model, pricing]) => {
      this.prices.set(model, pricing);
    });

    this.savePrices();
  }

  private async fetchLatestPrices(): Promise<void> {
    try {
      // Fetch from OpenAI's API pricing page
      const openaiResponse = await axios.get('https://api.openai.com/v1/models');
      // Note: This is a placeholder as OpenAI doesn't provide a public pricing API
      // In a real implementation, you might want to scrape their pricing page or use a third-party API

      // Fetch from Anthropic's API pricing page
      const anthropicResponse = await axios.get('https://api.anthropic.com/v1/models');
      // Note: This is a placeholder as Anthropic doesn't provide a public pricing API

      // Update prices based on responses
      // This is where you would parse the responses and update the prices
      
      this.lastUpdate = new Date();
      this.savePrices();
    } catch (error) {
      console.error('Failed to fetch latest LLM prices:', error);
    }
  }

  public async updatePrices(): Promise<void> {
    if (!this.lastUpdate || Date.now() - this.lastUpdate.getTime() > this.updateInterval) {
      await this.fetchLatestPrices();
    }
  }

  public getPricing(model: string): LLMPricing | undefined {
    return this.prices.get(model);
  }

  public getAllPrices(): Map<string, LLMPricing> {
    return new Map(this.prices);
  }

  private savePrices() {
    const pricesObj = Object.fromEntries(this.prices);
    localStorage.setItem('llmPrices', JSON.stringify(pricesObj));
  }

  public calculateCost(model: string, inputTokens: number, outputTokens: number): number {
    const pricing = this.prices.get(model);
    if (!pricing) return 0;

    return (
      (inputTokens / 1000) * pricing.inputPrice +
      (outputTokens / 1000) * pricing.outputPrice
    );
  }
}

export const llmPricingService = LLMPricingService.getInstance();