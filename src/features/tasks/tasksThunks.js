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

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (uid) => {
  const userTasksRef = collection(db, 'users', uid, 'tasks');
  const snapshot = await getDocs(userTasksRef);

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

export const addTask = createAsyncThunk('tasks/addTask', async ({ task, uid }) => {
  const userTasksRef = collection(db, 'users', uid, 'tasks');

  const taskForFirestore = {
    ...task,
    isCompleted: false,
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(userTasksRef, taskForFirestore);

  return {
    id: docRef.id,
    ...task,
    isCompleted: false,
    createdAt: new Date().toISOString(),
  };
});

export const updateTask = createAsyncThunk('tasks/updateTask', async ({ uid, task }) => {
  const { id, ...taskData } = task;
  const taskRef = doc(db, 'users', uid, 'tasks', id);
  await updateDoc(taskRef, taskData);
  return task;
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async ({ uid, id }) => {
  const taskRef = doc(db, 'users', uid, 'tasks', id);
  await deleteDoc(taskRef);
  return id;
});
