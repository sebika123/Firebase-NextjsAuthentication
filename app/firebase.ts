// firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  // apiKey: process.env.NEXT_PUBLIC_API_KEY,
  apiKey: "AIzaSyBY5EWkx50mvSFd3j6ebuiWCTKH-H_Hues",

  authDomain: "next-project-9ee16.firebaseapp.com",
  projectId: "next-project-9ee16",
  storageBucket: "next-project-9ee16.firebasestorage.app",
  messagingSenderId: "130304704022",
  appId: "1:130304704022:web:965adbfc8afe7b5b777f37",
  measurementId: "G-9WGD7SLWBN",
};

// Initialize Firebase only once (SSG/SSR safe)
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
