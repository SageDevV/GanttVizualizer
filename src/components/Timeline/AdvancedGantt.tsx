import { useMemo, useContext } from 'react';
import { Gantt, Task, ViewMode } from 'gantt-task-react';
import { PortugueseTaskListHeader } from './GanttCustomComponents';
import "gantt-task-react/dist/index.css";
import { ProjectContext } from '../../context/ProjectContext';
import { Activity } from '../../types/project';

interface AdvancedGanttProps {
  projectId: string;
  viewMode: ViewMode;
  onTaskClick?: (task: Task) => void;
  filterAssignee?: string;
  filterStatus?: string;
  searchQuery?: string;
}

export default function AdvancedGantt({
  projectId,
  viewMode,
  onTaskClick,
  filterAssignee,
  filterStatus,
  searchQuery,
}: AdvancedGanttProps) {
  const context = useContext(ProjectContext);
  if (!context) return null;

  const { state, dispatch } = context;

  // Filter activities for this project and apply other filters
  const activities = useMemo(() => {
    let filtered = state.activities.filter(a => a.projectId === projectId);

    if (filterAssignee) {
      filtered = filtered.filter(a => a.assignee === filterAssignee);
    }
    if (filterStatus) {
      filtered = filtered.filter(a => a.status === filterStatus);
    }
    if (searchQuery) {
      filtered = filtered.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    return filtered;
  }, [state.activities, projectId, filterAssignee, filterStatus, searchQuery]);

  // Map to gantt-task-react Task
  const tasks: Task[] = useMemo(() => {
    // Determine status colors
    const getColor = (a: Activity): string => {
      if (a.status === 'atrasada') return '#ef4444'; // red-500
      if (a.status === 'concluida') return '#10b981'; // green-500
      if (a.status === 'proximo-do-prazo') return '#f59e0b'; // amber-500
      return '#3b82f6'; // blue-500 - dentro do prazo
    };

    if (activities.length === 0) {
      return [];
    }

    return activities.map(a => {
      const color = getColor(a);
      return {
        id: a.id,
        type: a.type as "task" | "milestone" | "project",
        name: a.name,
        start: new Date(`${a.start}T00:00:00`),
        end: new Date(`${a.end}T23:59:59`),
        progress: a.progress,
        dependencies: a.dependencies,
        project: a.parentId,
        isDisabled: false,
        styles: {
          backgroundColor: color,
          progressColor: color,
          backgroundSelectedColor: color,
          progressSelectedColor: color,
          projectBackgroundColor: color,
          projectBackgroundSelectedColor: color,
          projectProgressColor: color,
          projectProgressSelectedColor: color,
          milestoneBackgroundColor: color,
          milestoneBackgroundSelectedColor: color
        }
      };
    });
  }, [activities]);

  const handleTaskChange = (task: Task) => {
    // Triggered on drag and drop (start/end or progress change)
    // Convert Dates back to YYYY-MM-DD
    const formatDate = (d: Date) => d.toISOString().split('T')[0];

    // We must find the original activity to update properly
    const activity = state.activities.find(a => a.id === task.id);
    if (!activity) return;

    // Update context
    dispatch({
      type: 'UPDATE_ACTIVITY',
      payload: {
        ...activity,
        start: formatDate(task.start),
        end: formatDate(task.end),
        progress: task.progress,
      }
    });
  };


  const handleProgressChange = async (task: Task) => {
    handleTaskChange(task);
  };

  const handleDblClick = (task: Task) => {
    if (onTaskClick) onTaskClick(task);
  };

  const handleSelect = () => { };

  const handleExpanderClick = () => { };

  if (tasks.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '256px', color: '#94a3b8', fontSize: '1.125rem', textAlign: 'center', padding: '0 2rem' }}>
        Nenhuma atividade encontrada neste projeto. Comece adicionando fases e tarefas.
      </div>
    );
  }



  return (
    <div style={{ width: '100%', overflowX: 'auto' }} className="gantt-light-theme">
      <Gantt
        tasks={tasks}
        locale="pt-BR"
        viewMode={viewMode}
        onDateChange={handleTaskChange}
        onProgressChange={handleProgressChange}
        onDoubleClick={handleDblClick}
        onClick={onTaskClick}
        onSelect={handleSelect}
        onExpanderClick={handleExpanderClick}
        listCellWidth="155px"
        columnWidth={viewMode === ViewMode.Month ? 150 : viewMode === ViewMode.Week ? 150 : 60}
        TaskListHeader={PortugueseTaskListHeader}
      />
    </div>
  );
}
