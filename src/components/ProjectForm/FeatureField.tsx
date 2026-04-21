import styles from './FeatureFieldList.module.css';

interface FeatureFieldProps {
  index: number;
  value: string;
  onChange: (index: number, value: string) => void;
  onRemove: (index: number) => void;
}

export default function FeatureField({ index, value, onChange, onRemove }: FeatureFieldProps) {
  return (
    <div className={styles.fieldRow}>
      <input
        className={styles.input}
        type="text"
        value={value}
        onChange={(e) => onChange(index, e.target.value)}
        placeholder={`Funcionalidade ${index + 1}`}
        aria-label={`Funcionalidade ${index + 1}`}
      />
      <button
        className={styles.removeButton}
        type="button"
        onClick={() => onRemove(index)}
        aria-label={`Remover funcionalidade ${index + 1}`}
      >
        ×
      </button>
    </div>
  );
}
