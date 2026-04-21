import type { Project } from '../../types/project';
import ProjectCard from './ProjectCard';
import styles from './ProjectList.module.css';

interface ProjectListProps {
  projects: Project[];
}

export default function ProjectList({ projects }: ProjectListProps) {
  if (projects.length === 0) {
    return <p className={styles.emptyState}>Nenhum projeto cadastrado.</p>;
  }

  return (
    <div className={styles.list}>
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
