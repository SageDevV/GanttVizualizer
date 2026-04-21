import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProjects } from '../../hooks/useProjects';
import AdvancedGantt from './AdvancedGantt';
import { ViewMode, Task } from 'gantt-task-react';
import ProjectDetailModal from '../Modal/ProjectDetailModal';
import styles from './TimelinePage.module.css';

export default function TimelinePage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { state } = useProjects();
  
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Month);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAssignee, setFilterAssignee] = useState('');
  
  // Adding modal logic
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const project = state.projects.find((p) => p.id === projectId);

  if (!project) {
    return (
      <div className={styles.page}>
        <div className={styles.notFound}>
          <p>Projeto não encontrado.</p>
          <Link to="/" className={styles.notFoundLink}>
            Voltar ao Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const handleTaskClick = (task: Task) => {
    setSelectedTaskId(task.id);
    setIsModalOpen(true);
  };

  const openNewActivityModal = () => {
    setSelectedTaskId(null);
    setIsModalOpen(true);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h1 className={styles.title}>{project.nome}</h1>
          <Link to="/" className={styles.backLink}>
            ← Voltar ao Dashboard
          </Link>
        </div>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <input 
              type="text" 
              placeholder="Buscar tarefa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            
            <input 
              type="text" 
              placeholder="Responsável"
              value={filterAssignee}
              onChange={(e) => setFilterAssignee(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />

            <select 
              value={viewMode} 
              onChange={(e) => setViewMode(e.target.value as ViewMode)}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value={ViewMode.Day}>Dia</option>
              <option value={ViewMode.Week}>Semana</option>
              <option value={ViewMode.Month}>Mês</option>
              <option value={ViewMode.Year}>Ano</option>
            </select>
            
            <button 
              onClick={openNewActivityModal}
              style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              + Nova Atividade
            </button>
        </div>
      </header>

      <main className={styles.content}>
        <div style={{ background: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
          <AdvancedGantt 
            projectId={project.id} 
            viewMode={viewMode} 
            searchQuery={searchQuery}
            filterAssignee={filterAssignee}
            onTaskClick={handleTaskClick}
          />
        </div>
      </main>

      {isModalOpen && (
        <ProjectDetailModal 
          projectId={project.id}
          activityId={selectedTaskId}
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
}
