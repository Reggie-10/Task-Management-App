import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import dayjs from 'dayjs';

const TaskItem = ({ task }) => {
  const formattedDate = task.dueDate
    ? dayjs(task.dueDate).format('DD MMM YYYY') // e.g., "18 Jul 2025"
    : 'No due date';

  return (
    <TouchableOpacity style={styles.item}>
      <Text style={styles.title}>{task.title || 'Untitled Task'}</Text>
      <Text style={styles.meta}>
        {formattedDate} | {task.priority || 'No priority'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#fff',
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    elevation: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  meta: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});

export default TaskItem;
