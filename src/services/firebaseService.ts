import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  where,
  writeBatch
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Project, Activity } from '../types/project';

const PROJECTS_COLLECTION = 'projects';
const ACTIVITIES_COLLECTION = 'activities';

/**
 * Remove undefined fields from an object as Firestore doesn't support them.
 * Using JSON serialization to deeply clean the object.
 */
function cleanData(data: any) {
  return JSON.parse(JSON.stringify(data));
}

export async function saveProjectToFirestore(userId: string, project: Project): Promise<void> {
  const projectRef = doc(db, PROJECTS_COLLECTION, project.id);
  await setDoc(projectRef, cleanData({ ...project, userId }));
}

export async function deleteProjectFromFirestore(userId: string, projectId: string): Promise<void> {
  // Delete project
  await deleteDoc(doc(db, PROJECTS_COLLECTION, projectId));

  // Delete all activities associated with this project
  const q = query(collection(db, ACTIVITIES_COLLECTION), where('projectId', '==', projectId), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  const batch = writeBatch(db);
  querySnapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();
}

export async function saveActivityToFirestore(userId: string, activity: Activity): Promise<void> {
  const activityRef = doc(db, ACTIVITIES_COLLECTION, activity.id);
  await setDoc(activityRef, cleanData({ ...activity, userId }));
}

export async function deleteActivityFromFirestore(activityId: string): Promise<void> {
  await deleteDoc(doc(db, ACTIVITIES_COLLECTION, activityId));
}

export async function loadUserDataFromFirestore(userId: string): Promise<{ projects: Project[], activities: Activity[] }> {
  const projectsQuery = query(collection(db, PROJECTS_COLLECTION), where('userId', '==', userId));
  const activitiesQuery = query(collection(db, ACTIVITIES_COLLECTION), where('userId', '==', userId));

  const [projectsSnapshot, activitiesSnapshot] = await Promise.all([
    getDocs(projectsQuery),
    getDocs(activitiesQuery)
  ]);

  const projects = projectsSnapshot.docs.map(doc => {
    const data = doc.data();
    // Exclude userId from the returned object
    const project = { ...data };
    delete (project as any).userId;
    return project as Project;
  });

  const activities = activitiesSnapshot.docs.map(doc => {
    const data = doc.data();
    // Exclude userId from the returned object
    const activity = { ...data };
    delete (activity as any).userId;
    return activity as Activity;
  });

  return { projects, activities };
}
