import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBTWmb0pBQytxEROg3TyI-TWgszNIh5-0E",
  authDomain: "taskmanagerapp-7730a.firebaseapp.com",
  projectId: "taskmanagerapp-7730a",
  storageBucket: "taskmanagerapp-7730a.firebasestorage.app",
  messagingSenderId: "539261807190",
  appId: "1:539261807190:web:0024018a7742e75c63e9f7",
  measurementId: "G-1MDXHF5Y22"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };