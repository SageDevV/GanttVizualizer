import { useState, useMemo } from 'react';
import { useProjects } from '../../hooks/useProjects';
import { useAuth } from '../../context/AuthContext';
import ProjectList from './ProjectList';
import NewProjectButton from './NewProjectButton';
import ProjectForm from '../ProjectForm/ProjectForm';
import type { ProjectFormData } from '../../types/project';
import { Gantt, Task, ViewMode } from 'gantt-task-react';
import { PortugueseTaskListHeader } from '../Timeline/GanttCustomComponents';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { logout } = useAuth();
  const { state, addProject } = useProjects();
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'cards' | 'gerencial'>('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Month);

  const handleFormSubmit = (data: ProjectFormData) => {
    addProject(data);
    setShowForm(false);
  };

  const gerencialTasks: Task[] = useMemo(() => {
    // Map projects into the master gantt
    if (state.projects.length === 0) return [];

    return state.projects
      .filter(p => p.nome.toLowerCase().includes(searchQuery.toLowerCase()))
      .map(p => {
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
          styles: {
            backgroundColor: '#6366f1',
            progressColor: '#4f46e5',
            progressSelectedColor: '#4f46e5',
            backgroundSelectedColor: '#6366f1',
            projectBackgroundColor: '#6366f1',
            projectBackgroundSelectedColor: '#6366f1',
            projectProgressColor: '#4f46e5',
            projectProgressSelectedColor: '#4f46e5'
          }
        };
      });
  }, [state.projects, state.activities]);

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>Visão Gerencial</h1>

          <div className={styles.tabGroup}>
            <button
              onClick={() => setActiveTab('cards')}
              className={`${styles.tabButton} ${activeTab === 'cards' ? styles.tabButtonActive : ''}`}
            >
              Lista de Projetos
            </button>
            <button
              onClick={() => setActiveTab('gerencial')}
              className={`${styles.tabButton} ${activeTab === 'gerencial' ? styles.tabButtonActive : ''}`}
            >
              Timeline Mãe (Todos os Projetos)
            </button>
          </div>
        </div>

        <div className={styles.actionGroup}>
          <button
            onClick={() => logout()}
            className={styles.logoutButton}
          >
            Sair
          </button>
          <NewProjectButton onClick={() => setShowForm(true)} />
        </div>
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
            <div className={styles.gerencialContent}>
              <div className={styles.toolbar}>
                <input
                  type="text"
                  placeholder="Buscar projeto..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.filterInput}
                />
                <select
                  value={viewMode}
                  onChange={(e) => setViewMode(e.target.value as ViewMode)}
                  className={styles.viewSelect}
                >
                  <option value={ViewMode.Day}>Dia</option>
                  <option value={ViewMode.Week}>Semana</option>
                  <option value={ViewMode.Month}>Mês</option>
                  <option value={ViewMode.Year}>Ano</option>
                </select>
              </div>

              <div className={styles.ganttContainer}>
                {gerencialTasks.length > 0 ? (
                  <div className="gantt-light-theme">
                    <Gantt
                      tasks={gerencialTasks}
                      locale="pt-BR"
                      viewMode={viewMode}
                      listCellWidth="155px"
                      TaskListHeader={PortugueseTaskListHeader}
                    />
                  </div>
                ) : (
                  <p className={styles.emptyState}>Nenhum projeto encontrado com os filtros aplicados.</p>
                )}
              </div>
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
