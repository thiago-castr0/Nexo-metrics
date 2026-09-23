'use client';

import { ChevronDown, Loader2, Globe } from 'lucide-react';
import { Project } from '@/hooks/useProjects';

interface ProjectSelectorProps {
  projects: Project[];
  selectedProjectId: string | null;
  onSelect: (id: string) => void;
  loading: boolean;
}

export function ProjectSelector({ projects, selectedProjectId, onSelect, loading }: ProjectSelectorProps) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-[#141414] border border-[#222222] rounded-lg w-64 animate-pulse print:hidden">
        <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
        <span className="text-sm text-gray-400 font-medium">Carregando projetos...</span>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200 print:hidden">
        Nenhum projeto encontrado.
      </div>
    );
  }

  return (
    <div className="relative group print:hidden">
      <div className="flex items-center">
        <Globe className="w-4 h-4 absolute left-3 text-gray-400 pointer-events-none z-10" />
        <select
          value={selectedProjectId || ''}
          onChange={(e) => onSelect(e.target.value)}
          className="appearance-none bg-[#141414] border border-[#222222] text-gray-200 text-sm font-medium rounded-lg focus:ring-2 focus:ring-[#39FF14] focus:border-[#39FF14] focus:outline-none block w-64 py-2.5 pl-9 pr-10 shadow-sm cursor-pointer hover:border-[#39FF14] hover:shadow-[0_0_10px_rgba(57,255,20,0.2)] transition-all duration-300"
        >
          {projects.map((project) => (
            <option key={project.id} value={project.id} className="bg-[#1a1a1a] text-gray-200">
              {project.name}
            </option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 absolute right-3 text-gray-500 pointer-events-none" />
      </div>
    </div>
  );
}
