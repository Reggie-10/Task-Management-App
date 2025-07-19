import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import { deleteTask, updateTask } from '../../features/tasks/tasksThunks';
import { getAuth } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';

const TaskItem = ({ task }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const auth = getAuth();

  const formattedDate = task.dueDate
    ? dayjs(task.dueDate).format('DD MMM YYYY')
    : 'No due date';

  const handleEdit = () => {
    navigation.navigate('EditTask', { task });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => {
            const uid = auth.currentUser?.uid;
            if (uid) {
              dispatch(deleteTask({ uid, id: task.id }));
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleToggleComplete = () => {
    const uid = auth.currentUser?.uid;
    if (uid) {
      dispatch(
        updateTask({
          uid,
          task: {
            ...task,
            isCompleted: !task.isCompleted,
          },
        })
      );
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return '#f44336'; // Red
      case 'medium':
        return '#ff9800'; // Orange
      case 'low':
        return '#4caf50'; // Green
      default:
        return '#757575'; // Grey
    }
  };

  return (
    <View style={styles.item}>
      <View style={{ flex: 1 }}>
        <Text
          style={[
            styles.title,
            task.isCompleted && { textDecorationLine: 'line-through', color: '#999' },
          ]}
        >
          {task.title || 'Untitled Task'}
        </Text>

        {task.description ? (
          <Text style={styles.description}>{task.description}</Text>
        ) : null}

        <View style={styles.metaContainer}>
          <Text style={styles.metaText}>{formattedDate}</Text>
          <Text style={[styles.priority, { color: getPriorityColor(task.priority) }]}>
            {task.priority || 'No priority'}
          </Text>
        </View>
      </View>

      <View style={styles.rightSide}>
        <TouchableOpacity onPress={handleToggleComplete} style={styles.checkbox}>
          <Ionicons
            name={task.isCompleted ? 'checkbox' : 'square-outline'}
            size={24}
            color={task.isCompleted ? '#4caf50' : '#999'}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleEdit} style={styles.iconBtn}>
          <Ionicons name="create-outline" size={20} color="#4caf50" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleDelete} style={styles.iconBtn}>
          <Ionicons name="trash-outline" size={20} color="#f44336" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#fff',
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    elevation: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
  },
  priority: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  rightSide: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  iconBtn: {
    marginLeft: 8,
  },
  checkbox: {
    marginRight: 8,
    marginTop: 2,
  },
});

export default TaskItem;
