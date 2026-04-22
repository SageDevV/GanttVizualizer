import { useNavigate } from 'react-router-dom';
import type { Project } from '../../types/project';
import { useProjects } from '../../hooks/useProjects';
import styles from './ProjectCard.module.css';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const navigate = useNavigate();
  const { deleteProject } = useProjects();

  const handleViewTimeline = () => {
    navigate(`/timeline/${project.id}`);
  };

  const handleCardClick = () => {
    navigate(`/timeline/${project.id}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita navegar para o projeto ao clicar em excluir
    if (window.confirm(`Tem certeza que deseja excluir o projeto "${project.nome}"? Esta ação não pode ser desfeita.`)) {
      deleteProject(project.id);
    }
  };

  return (
    <div className={styles.card} onClick={handleCardClick}>
      <button 
        className={styles.deleteButton} 
        onClick={handleDelete}
        title="Excluir Projeto"
        aria-label="Excluir Projeto"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
        </svg>
      </button>
      <div className={styles.cardInfo}>
        <h2 className={styles.projectName}>{project.nome}</h2>
        <span className={styles.responsavel}>Responsável: {project.responsavel}</span>
      </div>
      <button type="button" className={styles.timelineButton} onClick={handleViewTimeline}>
        Visualizar Timeline
      </button>
    </div>
  );
}
