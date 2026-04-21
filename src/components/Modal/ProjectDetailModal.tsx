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
      <div className={styles.modal} style={{ width: '500px', maxWidth: '90vw', overflowY: 'auto', maxHeight: '90vh' }}>
        <div className={styles.header}>
          <h2 className={styles.title}>{activityId ? 'Editar Atividade' : 'Nova Atividade'}</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div className={styles.body} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <label>Tipo</label>
                <select name="type" value={formData.type} onChange={handleChange} style={{ padding: '8px', borderRadius: '4px' }}>
                  <option value="project">Fase / Projeto Macro</option>
                  <option value="task">Subtarefa</option>
                  <option value="milestone">Marco (Milestone)</option>
                </select>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <label>Fase Pai (Opcional)</label>
                <select name="parentId" value={formData.parentId || ''} onChange={handleChange} style={{ padding: '8px', borderRadius: '4px' }}>
                  <option value="">Nenhuma</option>
                  {otherActivities.filter(a => a.type === 'project').map(a => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label>Nome da Atividade</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} style={{ padding: '8px', borderRadius: '4px' }} />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <label>Data de Início</label>
                <input type="date" name="start" value={formData.start} onChange={handleChange} style={{ padding: '8px', borderRadius: '4px' }} />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <label>Data de Fim</label>
                <input type="date" name="end" value={formData.end} onChange={handleChange} style={{ padding: '8px', borderRadius: '4px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <label>Progresso (%)</label>
                <input type="number" name="progress" min="0" max="100" value={formData.progress} onChange={handleProgressChange} style={{ padding: '8px', borderRadius: '4px' }} />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <label>Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value as ActivityStatus)} style={{ padding: '8px', borderRadius: '4px' }}>
                  <option value="dentro-do-prazo">Dentro do Prazo</option>
                  <option value="proximo-do-prazo">Próxima do Vencimento</option>
                  <option value="atrasada">Atrasada</option>
                  <option value="concluida">Concluída</option>
                </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <label>Responsável</label>
                <input type="text" name="assignee" value={formData.assignee} onChange={handleChange} style={{ padding: '8px', borderRadius: '4px' }} />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <label>Equipe</label>
                <input type="text" name="team" value={formData.team} onChange={handleChange} style={{ padding: '8px', borderRadius: '4px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label>Depende de (Bloqueada por)</label>
            <select 
              multiple 
              name="dependencies" 
              value={formData.dependencies} 
              onChange={(e) => {
                const values = Array.from(e.target.selectedOptions, option => option.value);
                setFormData(prev => ({ ...prev, dependencies: values }));
              }} 
              style={{ padding: '8px', borderRadius: '4px', height: '80px' }}
            >
              {otherActivities.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label>Descrição</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={3} style={{ padding: '8px', borderRadius: '4px' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
             {activityId ? (
                 <button onClick={handleDelete} style={{ padding: '10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>EXCLUIR</button>
             ) : (<div></div>)}
             <button onClick={handleAction} style={{ padding: '10px 24px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>SALVAR</button>
          </div>

        </div>
      </div>
    </div>
  );
}
