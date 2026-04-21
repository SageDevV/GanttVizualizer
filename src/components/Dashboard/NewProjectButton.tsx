import styles from './NewProjectButton.module.css';

interface NewProjectButtonProps {
  onClick?: () => void;
}

export default function NewProjectButton({ onClick }: NewProjectButtonProps) {
  return (
    <button type="button" className={styles.button} onClick={onClick}>
      <span className={styles.icon} aria-hidden="true">+</span>
      Novo Projeto
    </button>
  );
}
