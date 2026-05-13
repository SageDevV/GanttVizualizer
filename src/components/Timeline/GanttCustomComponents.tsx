import React from 'react';
import { Task } from 'gantt-task-react';
import { TASK_LIST_COLUMN_WIDTHS, formatDateBR } from './ganttHelpers';

/* ------------------------------------------------------------------ */
/*  Estilo base reutilizado nas células do TaskList                    */
/* ------------------------------------------------------------------ */
const cellBaseStyle: React.CSSProperties = {
  paddingLeft: '12px',
  paddingRight: '12px',
  display: 'flex',
  alignItems: 'center',
  height: '100%',
  borderRight: '1px solid #ebebeb',
  boxSizing: 'border-box',
};

/* ------------------------------------------------------------------ */
/*  Header customizado em português                                    */
/* ------------------------------------------------------------------ */
interface TaskListHeaderProps {
  headerHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
}

export const PortugueseTaskListHeader: React.FC<TaskListHeaderProps> = ({
  headerHeight,
  fontFamily,
  fontSize,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        height: headerHeight,
        fontFamily,
        fontSize,
        borderBottom: '1px solid #ebebeb',
        backgroundColor: '#f9f9f9',
        fontWeight: 700,
        color: '#555',
      }}
    >
      <div style={{ ...cellBaseStyle, width: TASK_LIST_COLUMN_WIDTHS.name }}>Nome</div>
      <div style={{ ...cellBaseStyle, width: TASK_LIST_COLUMN_WIDTHS.start }}>Início</div>
      <div
        style={{
          ...cellBaseStyle,
          width: TASK_LIST_COLUMN_WIDTHS.end,
          borderRight: 'none',
        }}
      >
        Fim
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Body (TaskListTable) com datas em DD/MM/AA                         */
/* ------------------------------------------------------------------ */
interface TaskListTableProps {
  rowHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
  locale: string;
  tasks: Task[];
  selectedTaskId: string;
  setSelectedTask: (taskId: string) => void;
  onExpanderClick: (task: Task) => void;
}

export const PortugueseTaskListTable: React.FC<TaskListTableProps> = ({
  rowHeight,
  fontFamily,
  fontSize,
  tasks,
}) => {
  return (
    <div style={{ fontFamily, fontSize, color: '#1f2328' }}>
      {tasks.map((t) => (
        <div
          key={t.id}
          style={{
            display: 'flex',
            height: rowHeight,
            borderBottom: '1px solid #ebebeb',
          }}
        >
          <div style={{ ...cellBaseStyle, width: TASK_LIST_COLUMN_WIDTHS.name }}>
            <span
              title={t.name}
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                width: '100%',
              }}
            >
              {t.name}
            </span>
          </div>
          <div style={{ ...cellBaseStyle, width: TASK_LIST_COLUMN_WIDTHS.start }}>
            {formatDateBR(t.start)}
          </div>
          <div
            style={{
              ...cellBaseStyle,
              width: TASK_LIST_COLUMN_WIDTHS.end,
              borderRight: 'none',
            }}
          >
            {formatDateBR(t.end)}
          </div>
        </div>
      ))}
    </div>
  );
};
