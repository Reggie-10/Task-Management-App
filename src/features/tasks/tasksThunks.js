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
    return {
      id: docSnap.id,
      ...data,
      // Convert Firestore Timestamp to ISO string for serializability
      dueDate: data.dueDate?.toDate().toISOString() || null,
      createdAt: data.createdAt?.toDate().toISOString() || null,
    };
  });
});

// ✅ Add task to Firestore
export const addTask = createAsyncThunk('tasks/addTask', async (task) => {
  const newTask = {
    ...task,
    isCompleted: false,
    createdAt: serverTimestamp(),
  };
  const docRef = await addDoc(tasksRef, newTask);
  return { id: docRef.id, ...newTask };
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
