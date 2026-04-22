import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCWs_P0Vbnxo0y0Jgbo6hHBewqJi8uJQQ8",
  authDomain: "timelinegantt.firebaseapp.com",
  projectId: "timelinegantt",
  storageBucket: "timelinegantt.firebasestorage.app",
  messagingSenderId: "1017765630995",
  appId: "1:1017765630995:web:1a379fe6df447dfa26dbe6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
