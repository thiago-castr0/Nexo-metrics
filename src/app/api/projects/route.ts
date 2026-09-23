import { NextResponse } from 'next/server';
import { fetchVercelAPI } from '@/lib/vercelApi';

export async function GET() {
  try {
    const data = await fetchVercelAPI('/v9/projects');

    // Sanitização: Mapeamos apenas os campos necessários (Clean Code/Segurança)
    const sanitizedProjects = data.projects.map((project: any) => ({
      id: project.id,
      name: project.name,
      framework: project.framework,
      // URL de produção se existir
      url: project.targets?.production?.url || null,
    }));

    return NextResponse.json({ projects: sanitizedProjects }, { status: 200 });
  } catch (error: any) {
    console.error('[API Projects Error]:', error);
    
    // Devolvendo uma mensagem amigável e encapsulando o erro
    return NextResponse.json(
      { error: error.message || 'Erro interno ao buscar projetos.' },
      { status: 500 }
    );
  }
}
