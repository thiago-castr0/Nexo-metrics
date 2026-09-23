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
        setProjects(data.projects);
        
        // Seleciona automaticamente o primeiro projeto da lista se não houver um definido
        if (data.projects && data.projects.length > 0 && !selectedProjectId) {
          setSelectedProjectId(data.projects[0].id);
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
