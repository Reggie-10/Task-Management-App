import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../data/firebase/firebase';

const tasksRef = collection(db, 'tasks');

// ✅ Fetch tasks from Firestore
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  const snapshot = await getDocs(tasksRef);
  return snapshot.docs.map(docSnap => {
    const data = docSnap.data();

    const getDateString = (field) => {
      if (!data[field]) return null;
      const value = data[field];
      if (typeof value === 'string') return value;
      if (typeof value?.toDate === 'function') return value.toDate().toISOString();
      return null;
    };

    return {
      id: docSnap.id,
      ...data,
      dueDate: getDateString('dueDate'),
      createdAt: getDateString('createdAt'),
    };
  });
});


// ✅ Add task to Firestore (🔥 FIXED: don't return serverTimestamp to Redux)
export const addTask = createAsyncThunk('tasks/addTask', async (task) => {
  const taskForFirestore = {
    ...task,
    isCompleted: false,
    createdAt: serverTimestamp(), // only for Firestore
  };

  const docRef = await addDoc(tasksRef, taskForFirestore);

  return {
    id: docRef.id,
    ...task,
    isCompleted: false,
    // ✅ Use client timestamp here for Redux
    createdAt: new Date().toISOString(),
  };
});

// ✅ Update existing task
export const updateTask = createAsyncThunk('tasks/updateTask', async (task) => {
  const { id, ...taskData } = task;
  const taskRef = doc(db, 'tasks', id);
  await updateDoc(taskRef, taskData);
  return task;
});

// ✅ Delete task by ID
export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id) => {
  await deleteDoc(doc(db, 'tasks', id));
  return id;
});
