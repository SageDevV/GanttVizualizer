import { useState, useMemo } from 'react';
import { useProjects } from '../../hooks/useProjects';
import ProjectList from './ProjectList';
import NewProjectButton from './NewProjectButton';
import ProjectForm from '../ProjectForm/ProjectForm';
import type { ProjectFormData } from '../../types/project';
import { Gantt, Task, ViewMode } from 'gantt-task-react';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { state, addProject } = useProjects();
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'cards' | 'gerencial'>('cards');

  const handleFormSubmit = (data: ProjectFormData) => {
    addProject(data);
    setShowForm(false);
  };

  const gerencialTasks: Task[] = useMemo(() => {
    // Map projects into the master gantt
    if (state.projects.length === 0) return [];
    
    return state.projects.map(p => {
       // calculate progress based on activities
       const pActivities = state.activities.filter(a => a.projectId === p.id);
       let progress = 0;
       if (pActivities.length > 0) {
         progress = pActivities.reduce((acc, curr) => acc + curr.progress, 0) / pActivities.length;
       }

       return {
         id: p.id,
         type: "project" as const,
         name: p.nome,
         start: new Date(`${p.dataInicio}T00:00:00`),
         end: new Date(`${p.dataFim}T23:59:59`),
         progress: progress,
         isDisabled: true, // Master view is read-only for now
         styles: { backgroundColor: '#6366f1', progressColor: '#4f46e5', progressSelectedColor: '#4f46e5', backgroundSelectedColor: '#6366f1' }
       };
    });
  }, [state.projects, state.activities]);

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h1 className={styles.title}>Visão Gerencial</h1>
          
          <div style={{ display: 'flex', gap: '16px', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>
             <button 
              onClick={() => setActiveTab('cards')} 
               style={{ 
                 background: 'none', 
                 border: 'none', 
                 fontSize: '16px', 
                 fontWeight: activeTab === 'cards' ? 'bold' : 'normal',
                 color: activeTab === 'cards' ? '#3b82f6' : '#6b7280',
                 cursor: 'pointer'
               }}
             >
               Lista de Projetos
             </button>
             <button 
               onClick={() => setActiveTab('gerencial')} 
               style={{ 
                 background: 'none', 
                 border: 'none', 
                 fontSize: '16px', 
                 fontWeight: activeTab === 'gerencial' ? 'bold' : 'normal',
                 color: activeTab === 'gerencial' ? '#3b82f6' : '#6b7280',
                 cursor: 'pointer'
               }}
             >
               Timeline Mãe (Todos os Projetos)
             </button>
          </div>
        </div>

        <NewProjectButton onClick={() => setShowForm(true)} />
      </header>

      <main className={styles.content}>
        {state.loading ? (
          <div className={styles.loading} role="status" aria-label="Carregando projetos">
            <span className={styles.spinner} />
            Carregando projetos...
          </div>
        ) : (
          activeTab === 'cards' ? (
             <ProjectList projects={state.projects} />
          ) : (
             <div style={{ background: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                {gerencialTasks.length > 0 ? (
                  <Gantt 
                    tasks={gerencialTasks} 
                    viewMode={ViewMode.Month} 
                    listCellWidth="155px" 
                  />
                ) : (
                  <p>Nenhum projeto cadastrado.</p>
                )}
             </div>
          )
        )}
      </main>

      {showForm && (
        <ProjectForm
          onClose={() => setShowForm(false)}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}
