import { ProjectState, ProjectAction } from '../types/project';

export const initialState: ProjectState = {
  projects: [],
  activities: [],
  loading: true,
};

export function projectReducer(state: ProjectState, action: ProjectAction): ProjectState {
  switch (action.type) {
    case 'LOAD_DATA':
      return {
        ...state,
        projects: action.payload.projects,
        activities: action.payload.activities,
        loading: false,
      };

    // --- Projects ---
    case 'ADD_PROJECT':
      return {
        ...state,
        projects: [...state.projects, action.payload],
      };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map((p) => (p.id === action.payload.id ? action.payload : p)),
      };
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter((p) => p.id !== action.payload),
        activities: state.activities.filter((a) => a.projectId !== action.payload),
      };

    // --- Activities ---
    case 'ADD_ACTIVITY':
      return {
        ...state,
        activities: [...state.activities, action.payload],
      };
    case 'UPDATE_ACTIVITY':
      return {
        ...state,
        activities: state.activities.map((a) => (a.id === action.payload.id ? action.payload : a)),
      };
    case 'DELETE_ACTIVITY':
      return {
        ...state,
        activities: state.activities.filter((a) => a.id !== action.payload),
      };
    case 'UPDATE_ACTIVITY_DATES':
      return {
        ...state,
        activities: state.activities.map((a) => {
          if (a.id === action.payload.id) {
            return { ...a, start: action.payload.start, end: action.payload.end };
          }
          return a;
        }),
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
}
