import {
  INodeType,
  INodeTypeDescription,
  ISupplyDataFunctions,
  SupplyData,
} from 'n8n-workflow';
import { ChatOpenAI } from '@langchain/openai';

export class LmChatAiberm implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Aiberm Chat Model',
    name: 'lmChatAiberm',
    icon: 'file:aiberm.svg',
    group: ['transform'],
    version: 1,
    description: 'Aiberm AI models via OpenAI-compatible API',
    defaults: { name: 'Aiberm Chat Model' },
    codex: {
      categories: ['AI'],
      subcategories: {
        AI: ['Language Models', 'Root Nodes'],
      },
      resources: {
        primaryDocumentation: [{ url: 'https://aiberm.com/docs' }],
      },
    },
    inputs: [],
    outputs: ['ai_languageModel'],
    outputNames: ['Model'],
    credentials: [
      {
        name: 'aibermApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Model',
        name: 'model',
        type: 'string',
        default: 'gpt-4o-mini',
        description: 'Model name — e.g. gpt-4o, claude-sonnet-4-5-20250929. See aiberm.com for full list.',
      },
      {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        options: [
          {
            displayName: 'Temperature',
            name: 'temperature',
            type: 'number',
            typeOptions: { minValue: 0, maxValue: 2 },
            default: 0.7,
          },
          {
            displayName: 'Max Tokens',
            name: 'maxTokens',
            type: 'number',
            default: 1024,
          },
        ],
      },
    ],
  };

  async supplyData(this: ISupplyDataFunctions, itemIndex: number): Promise<SupplyData> {
    const credentials = await this.getCredentials('aibermApi');
    const model = this.getNodeParameter('model', itemIndex) as string;
    const options = this.getNodeParameter('options', itemIndex, {}) as {
      temperature?: number;
      maxTokens?: number;
    };

    const chatModel = new ChatOpenAI({
      openAIApiKey: credentials.apiKey as string,
      modelName: model,
      temperature: options.temperature ?? 0.7,
      maxTokens: options.maxTokens ?? 1024,
      configuration: {
        baseURL: 'https://aiberm.com/v1',
      },
    });

    return { response: chatModel };
  }
}