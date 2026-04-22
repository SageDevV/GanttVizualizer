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
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>{project.nome}</h1>
          <Link to="/" className={styles.backLink}>
            ← Voltar ao Dashboard
          </Link>
        </div>
        
        <div className={styles.filterGroup}>
            <input 
              type="text" 
              placeholder="Buscar tarefa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.input}
            />
            
            <input 
              type="text" 
              placeholder="Responsável"
              value={filterAssignee}
              onChange={(e) => setFilterAssignee(e.target.value)}
              className={styles.input}
            />

            <select 
              value={viewMode} 
              onChange={(e) => setViewMode(e.target.value as ViewMode)}
              className={styles.select}
            >
              <option value={ViewMode.Day}>Dia</option>
              <option value={ViewMode.Week}>Semana</option>
              <option value={ViewMode.Month}>Mês</option>
              <option value={ViewMode.Year}>Ano</option>
            </select>
            
            <button 
              onClick={openNewActivityModal}
              className={styles.actionButton}
            >
              + Nova Atividade
            </button>
        </div>
      </header>

      <main className={styles.content}>
        <div className={styles.ganttCard}>
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
