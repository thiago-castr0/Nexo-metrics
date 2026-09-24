import { useState, useEffect } from 'react';

export interface Project {
  id: string;
  name: string;
  framework: string | null;
  url: string | null;
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // O estado do projeto selecionado.
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch('/api/projects');
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Falha ao buscar projetos');
        }
        
        const data = await res.json();
        
        const formatProjectName = (name: string) => {
          const map: Record<string, string> = {
            'casa-juventude-v1': 'Casa da Juventude',
            'portif-lio': 'Portfólio',
            'nexo-metrics': 'Nexo Metrics',
          };
          return map[name] || name;
        };

        const formattedProjects = (data.projects || []).map((p: Project) => ({
          ...p,
          name: formatProjectName(p.name)
        }));

        setProjects(formattedProjects);
        
        // Seleciona automaticamente o primeiro projeto da lista se não houver um definido
        if (formattedProjects.length > 0 && !selectedProjectId) {
          setSelectedProjectId(formattedProjects[0].id);
        }
        
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Executa apenas no carregamento inicial

  return {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    loading,
    error,
  };
}
