import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { addTask } from '../../features/tasks/tasksThunks';
import dayjs from 'dayjs';

const AddTaskScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');

  const handleAddTask = () => {
    if (!title.trim()) return Alert.alert('Validation', 'Title is required');

    const newTask = {
      title,
      description,
      priority,
      dueDate: new Date().toISOString(),
      isCompleted: false,
      createdAt: new Date().toISOString(),
    };

    dispatch(addTask(newTask))
      .unwrap()
      .then(() => navigation.goBack())
      .catch(err => Alert.alert('Error', 'Failed to add task'));
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        multiline
      />
      <TextInput
        placeholder="Priority (Low, Medium, High)"
        value={priority}
        onChangeText={setPriority}
        style={styles.input}
      />
      <Button title="Add Task" onPress={handleAddTask} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1 },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    padding: 8,
  },
});

export default AddTaskScreen;
