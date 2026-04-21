import { useNavigate } from 'react-router-dom';
import type { Project } from '../../types/project';
import styles from './ProjectCard.module.css';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const navigate = useNavigate();

  const handleViewTimeline = () => {
    navigate(`/timeline/${project.id}`);
  };

  return (
    <div className={styles.card}>
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
