import type { SettingsPage } from '~/types/settings';
import { PromptsLibrary } from '~/components/settings/pages/PromptsLibrary';
import { LocalProviders } from '~/components/settings/pages/LocalProviders';

export const settingsPages: SettingsPage[] = [
  {
    id: 'local-providers',
    name: 'Local AI Providers',
    icon: 'i-ph:desktop',
    component: LocalProviders,
    description: 'Configure local AI providers like Ollama and LM Studio'
  },
  {
    id: 'cloud-providers',
    name: 'AI Providers',
    icon: 'i-ph:robot',
    component: PromptsLibrary, // Placeholder - will be implemented later
    description: 'Configure cloud AI model providers'
  },
  {
    id: 'prompts',
    name: 'Prompts Library',
    icon: 'i-ph:newspaper',
    component: PromptsLibrary,
    description: 'Manage system prompts'
  }
];
