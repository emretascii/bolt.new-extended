import { json, type LoaderFunctionArgs } from '@remix-run/cloudflare';
import { MODEL_LIST } from '~/utils/modelConstants';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const search = url.searchParams.get('search')?.toLowerCase() || '';

  let filteredModels = MODEL_LIST.filter((model) =>
    model.name.toLowerCase().includes(search) ||
    model.provider.toLowerCase().includes(search) ||
    model.label.toLowerCase().includes(search)
  );

  // Add pricing information for local models
  filteredModels = filteredModels.map(model => {
    if (['Ollama', 'LMStudio', 'LocalAI'].includes(model.provider)) {
      return {
        ...model,
        inputPrice: 0,
        outputPrice: 0
      };
    }
    return model;
  });

  return json(filteredModels);
}
