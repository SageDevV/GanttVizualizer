import styles from './FeatureFieldList.module.css';
import FeatureField from './FeatureField';

interface FeatureFieldListProps {
  funcionalidades: string[];
  onChange: (funcionalidades: string[]) => void;
}

export default function FeatureFieldList({ funcionalidades, onChange }: FeatureFieldListProps) {
  const handleAdd = () => {
    onChange([...funcionalidades, '']);
  };

  const handleChange = (index: number, value: string) => {
    const updated = [...funcionalidades];
    updated[index] = value;
    onChange(updated);
  };

  const handleRemove = (index: number) => {
    const updated = funcionalidades.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className={styles.container}>
      <span className={styles.label}>Funcionalidades</span>

      {funcionalidades.map((func, index) => (
        <FeatureField
          key={index}
          index={index}
          value={func}
          onChange={handleChange}
          onRemove={handleRemove}
        />
      ))}

      <button
        className={styles.addButton}
        type="button"
        onClick={handleAdd}
      >
        + Adicionar Funcionalidade
      </button>
    </div>
  );
}
