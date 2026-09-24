import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

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
  
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    // Only run when we know the user state (it could be null, but we'll fetch once we are sure, or just fetch right away)
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

        let formattedProjects = (data.projects || []).map((p: Project) => ({
          ...p,
          name: formatProjectName(p.name)
        }));

        // Filtro de acordo com a role
        if (user?.role === 'prometheus') {
           formattedProjects = formattedProjects.filter((p: Project) => p.name === 'Casa da Juventude');
        }

        setProjects(formattedProjects);
        
        if (formattedProjects.length > 0 && !selectedProjectId) {
          setSelectedProjectId(formattedProjects[0].id);
        }
        
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (user !== undefined) {
      fetchProjects();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    loading,
    error,
  };
}
