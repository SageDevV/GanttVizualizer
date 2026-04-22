import { useState, useContext, useEffect } from 'react';
import { ProjectContext } from '../../context/ProjectContext';
import { ActivityFormData, ActivityStatus } from '../../types/project';
import styles from './ProjectDetailModal.module.css';

interface ProjectDetailModalProps {
  projectId: string;
  activityId?: string | null;
  onClose: () => void;
}

export default function ProjectDetailModal({ projectId, activityId, onClose }: ProjectDetailModalProps) {
  const context = useContext(ProjectContext);
  if (!context) return null;

  const { state, addActivity, updateActivity, deleteActivity } = context;

  const [formData, setFormData] = useState<ActivityFormData>({
    type: 'task',
    name: '',
    assignee: '',
    team: '',
    category: '',
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
    progress: 0,
    dependencies: [],
    parentId: undefined,
    projectId: projectId,
    description: '',
  });

  const [status, setStatus] = useState<ActivityStatus>('dentro-do-prazo');

  useEffect(() => {
    if (activityId) {
      const existing = state.activities.find(a => a.id === activityId);
      if (existing) {
        setFormData({ ...existing });
        setStatus(existing.status);
      }
    }
  }, [activityId, state.activities]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, progress: Number(e.target.value) }));
    if (Number(e.target.value) === 100) {
        setStatus('concluida');
    }
  };

  const handleAction = () => {
    if (activityId) {
      const existing = state.activities.find(a => a.id === activityId);
      if (existing) {
        updateActivity({ ...existing, ...formData, status });
      }
    } else {
      addActivity({ ...formData, status } as any); // We add 'status' when saving, ignoring type strictly in form data
    }
    onClose();
  };

  const handleDelete = () => {
    if (activityId) {
      deleteActivity(activityId);
      onClose();
    }
  };

  const otherActivities = state.activities.filter(a => a.projectId === projectId && a.id !== activityId);

  return (
    <div className={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>{activityId ? 'Editar Atividade' : 'Nova Atividade'}</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Fechar">×</button>
        </div>

        <div className={styles.body}>
          
          <div className={styles.fieldGroup}>
            <div className={styles.field}>
                <label className={styles.label}>Tipo</label>
                <select name="type" value={formData.type} onChange={handleChange} className={styles.select}>
                  <option value="project">Fase / Projeto Macro</option>
                  <option value="task">Subtarefa</option>
                  <option value="milestone">Marco (Milestone)</option>
                </select>
            </div>
            <div className={styles.field}>
                <label className={styles.label}>Fase Pai (Opcional)</label>
                <select name="parentId" value={formData.parentId || ''} onChange={handleChange} className={styles.select}>
                  <option value="">Nenhuma</option>
                  {otherActivities.filter(a => a.type === 'project').map(a => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Nome da Atividade</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className={styles.input} placeholder="Ex: Desenvolvimento de API" />
          </div>

          <div className={styles.fieldGroup}>
            <div className={styles.field}>
                <label className={styles.label}>Data de Início</label>
                <input type="date" name="start" value={formData.start} onChange={handleChange} className={styles.input} />
            </div>
            <div className={styles.field}>
                <label className={styles.label}>Data de Fim</label>
                <input type="date" name="end" value={formData.end} onChange={handleChange} className={styles.input} />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <div className={styles.field}>
                <label className={styles.label}>Progresso ({formData.progress}%)</label>
                <input type="range" name="progress" min="0" max="100" value={formData.progress} onChange={handleProgressChange} className={styles.input} style={{ padding: '0.5rem 0' }} />
            </div>
            <div className={styles.field}>
                <label className={styles.label}>Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value as ActivityStatus)} className={styles.select}>
                  <option value="dentro-do-prazo">Dentro do Prazo</option>
                  <option value="proximo-do-prazo">Próxima do Vencimento</option>
                  <option value="atrasada">Atrasada</option>
                  <option value="concluida">Concluída</option>
                </select>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <div className={styles.field}>
                <label className={styles.label}>Responsável</label>
                <input type="text" name="assignee" value={formData.assignee} onChange={handleChange} className={styles.input} placeholder="Nome do responsável" />
            </div>
            <div className={styles.field}>
                <label className={styles.label}>Equipe</label>
                <input type="text" name="team" value={formData.team} onChange={handleChange} className={styles.input} placeholder="Nome da equipe" />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Depende de (Bloqueada por)</label>
            <select 
              multiple 
              name="dependencies" 
              value={formData.dependencies} 
              onChange={(e) => {
                const values = Array.from(e.target.selectedOptions, option => option.value);
                setFormData(prev => ({ ...prev, dependencies: values }));
              }} 
              className={styles.select}
              style={{ height: 'auto', minHeight: '80px' }}
            >
              {otherActivities.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Descrição</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className={styles.textarea} placeholder="Detalhes da atividade..." />
          </div>

          <div className={styles.actions}>
             {activityId ? (
                 <button onClick={handleDelete} className={styles.deleteButton}>EXCLUIR ATIVIDADE</button>
             ) : (<div></div>)}
             <button onClick={handleAction} className={styles.saveButton}>SALVAR ATIVIDADE</button>
          </div>

        </div>
      </div>
    </div>
  );
}
