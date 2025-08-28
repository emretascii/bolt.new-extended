export interface LocalProvider {
  name: string;
  baseURL: string;
  apiKey?: string;
  models: string[];
}

export const LOCAL_PROVIDERS: LocalProvider[] = [
  {
    name: 'Ollama',
    baseURL: 'http://localhost:11434/v1',
    models: ['llama2', 'codellama', 'mistral', 'neural-chat']
  },
  {
    name: 'LMStudio',
    baseURL: 'http://localhost:1234/v1',
    models: ['local-model']
  },
  {
    name: 'LocalAI',
    baseURL: 'http://localhost:8080/v1',
    models: ['gpt-3.5-turbo', 'gpt-4']
  }
];

export async function detectLocalModels(baseURL: string): Promise<string[]> {
  try {
    const response = await fetch(`${baseURL}/models`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    return data.data?.map((model: any) => model.id) || [];
  } catch (error) {
    console.error('Failed to detect local models:', error);
    return [];
  }
}