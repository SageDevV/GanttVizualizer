import type { Project, Activity } from '../types/project';

interface StorageData {
  projects: Project[];
  activities: Activity[];
}

export function serializeData(data: StorageData): string {
  return JSON.stringify(data);
}

export function deserializeData(json: string): StorageData {
  return JSON.parse(json) as StorageData;
}
