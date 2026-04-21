import type { Project, Activity } from '../types/project';
import { serializeData, deserializeData } from '../utils/projectSerializer';

const STORAGE_KEY = 'gantt-projects-v2';

interface StorageData {
  projects: Project[];
  activities: Activity[];
}

export function loadData(): StorageData {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data === null) {
      return { projects: [], activities: [] };
    }
    return deserializeData(data);
  } catch (error) {
    if (error instanceof DOMException && error.name === 'SecurityError') {
      console.warn('localStorage indisponível:', error);
    } else {
      console.error('Erro ao carregar dados:', error);
    }
    return { projects: [], activities: [] };
  }
}

export function saveData(data: StorageData): void {
  try {
    const serializedData = serializeData(data);
    localStorage.setItem(STORAGE_KEY, serializedData);
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.error('Quota de localStorage excedida:', error);
    } else if (error instanceof DOMException && error.name === 'SecurityError') {
      console.warn('localStorage indisponível:', error);
    } else {
      console.error('Erro ao salvar dados:', error);
    }
  }
}
