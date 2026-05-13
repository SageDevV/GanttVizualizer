import { ViewMode } from 'gantt-task-react';

/**
 * Larguras individuais das colunas do TaskList (lado esquerdo do Gantt).
 *
 * - "Nome" recebe largura ampliada para evitar truncamento de nomes de projeto.
 * - "Início" e "Fim" usam largura compacta, dimensionada para o formato DD/MM/AA.
 *
 * A biblioteca `gantt-task-react` mede automaticamente o `offsetWidth` real do
 * TaskList (ver `gantt.tsx`), portanto basta usar valores fixos aqui — a prop
 * `listCellWidth` continua sendo passada apenas como gatilho para "exibir o
 * TaskList" (qualquer string truthy serve).
 */
export const TASK_LIST_COLUMN_WIDTHS = {
  name: 320,
  start: 110,
  end: 110,
} as const;

/**
 * Retorna a largura adequada de cada coluna do gráfico (área da timeline)
 * para evitar sobreposição dos rótulos de período (mês/semana/dia/ano).
 *
 * Os valores espelham os defaults recomendados pela biblioteca
 * `gantt-task-react`, garantindo que rótulos como "Janeiro 2026" caibam
 * sem se sobrepor.
 */
export function getGanttColumnWidth(mode: ViewMode): number {
  switch (mode) {
    case ViewMode.Year:
      return 350;
    case ViewMode.Month:
      return 300;
    case ViewMode.Week:
      return 250;
    case ViewMode.Day:
    default:
      return 65;
  }
}

/** Formata uma `Date` no padrão brasileiro DD/MM/AA (ano com dois dígitos). */
export function formatDateBR(date: Date): string {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yy = String(date.getFullYear()).slice(-2);
  return `${dd}/${mm}/${yy}`;
}
