export const VERCEL_API_URL = 'https://api.vercel.com';

export async function fetchVercelAPI(endpoint: string, options: RequestInit = {}) {
  const token = process.env.VERCEL_API_TOKEN;
  const teamId = process.env.VERCEL_TEAM_ID;

  if (!token) {
    throw new Error('VERCEL_API_TOKEN não está configurado.');
  }

  // Permite passar query params já na string do endpoint
  const url = new URL(`${VERCEL_API_URL}${endpoint}`);
  
  if (teamId) {
    url.searchParams.append('teamId', teamId);
  }

  const response = await fetch(url.toString(), {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    // Vercel retorna 429 para rate limit
    if (response.status === 429) {
      throw new Error('Limite de requisições atingido. Aguarde um momento.');
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Erro HTTP ${response.status}`);
  }

  return response.json();
}
