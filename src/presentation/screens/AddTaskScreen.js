import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Alert,
  Platform,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import {
  Button,
  Menu,
  Provider as PaperProvider,
  Text,
} from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { addTask } from '../../features/tasks/tasksThunks';
import { getAuth } from 'firebase/auth';
import { DatePickerModal } from 'react-native-paper-dates';
import dayjs from 'dayjs';

const AddTaskScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState(new Date());

  const [menuVisible, setMenuVisible] = useState(false);
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const onConfirmDate = ({ date }) => {
    setDatePickerVisible(false);
    setDueDate(date);
  };

  const handleAddTask = () => {
    if (!title.trim()) return Alert.alert('Validation', 'Title is required');

    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      return Alert.alert('Error', 'User not logged in');
    }

    const newTask = {
      title,
      description,
      priority,
      dueDate: dueDate.toISOString(),
    };

    dispatch(addTask({ task: newTask, uid: currentUser.uid }))
      .unwrap()
      .then(() => navigation.goBack())
      .catch(err => {
        console.error(err);
        Alert.alert('Error', 'Failed to add task');
      });
  };

  return (
    <PaperProvider>
      <SafeAreaView style={styles.safeArea}>
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
            style={styles.textArea}
            multiline
          />

          <View style={styles.dropdownContainer}>
            <Menu
              visible={menuVisible}
              onDismiss={closeMenu}
              anchor={
                <Button mode="outlined" onPress={openMenu}>
                  Priority: {priority}
                </Button>
              }
            >
              <Menu.Item
                onPress={() => {
                  setPriority('Low');
                  closeMenu();
                }}
                title="Low"
              />
              <Menu.Item
                onPress={() => {
                  setPriority('Medium');
                  closeMenu();
                }}
                title="Medium"
              />
              <Menu.Item
                onPress={() => {
                  setPriority('High');
                  closeMenu();
                }}
                title="High"
              />
            </Menu>
          </View>

          <Button mode="outlined" onPress={() => setDatePickerVisible(true)} style={{ marginBottom: 12 }}>
            Due Date: {dayjs(dueDate).format('DD MMM YYYY')}
          </Button>

          <DatePickerModal
            locale="en"
            mode="single"
            visible={datePickerVisible}
            onDismiss={() => setDatePickerVisible(false)}
            date={dueDate}
            onConfirm={onConfirmDate}
            validRange={{
              startDate: dayjs().startOf('day').toDate(),
            }}
          />
          <Button mode="contained" onPress={handleAddTask}>
            Add Task
          </Button>
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    padding: 16,
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    padding: 8,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 12,
    padding: 8,
    height: 100,
    textAlignVertical: 'top',
  },
  dropdownContainer: {
    marginBottom: 16,
  },
});

export default AddTaskScreen;
