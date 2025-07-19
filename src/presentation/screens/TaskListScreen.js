import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTasks } from '../../features/tasks/tasksThunks';
import { getAuth, signOut } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import TaskItem from '../components/TaskItem';
import dayjs from 'dayjs';

const TaskListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const tasks = useSelector(state => state.tasks.tasks);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) {
      setError('User not logged in');
      setLoading(false);
      return;
    }

    dispatch(fetchTasks(currentUser.uid))
      .unwrap()
      .then(() => setLoading(false))
      .catch(err => {
        console.error('Failed to load tasks:', err);
        setError('Something went wrong');
        setLoading(false);
      });
  }, []);

  const priorityOrder = { High: 1, Medium: 2, Low: 3 };

  const categorizeAndSortTasks = (tasks) => {
    const today = dayjs().startOf('day');
    const tomorrow = today.add(1, 'day');
    const weekEnd = today.add(7, 'day');
    const monthEnd = today.endOf('month');
    const nextMonthEnd = today.add(1, 'month').endOf('month');

    const sections = {
      Today: [],
      Tomorrow: [],
      'This Week': [],
      'Later This Month': [],
      'Next Month': [],
      Upcoming: [],
    };

    tasks.forEach(task => {
      const due = dayjs(task.dueDate);
      if (!due.isValid()) return;

      if (due.isSame(today, 'day')) {
        sections.Today.push(task);
      } else if (due.isSame(tomorrow, 'day')) {
        sections.Tomorrow.push(task);
      } else if (due.isBefore(weekEnd)) {
        sections['This Week'].push(task);
      } else if (due.isBefore(monthEnd)) {
        sections['Later This Month'].push(task);
      } else if (due.isBefore(nextMonthEnd)) {
        sections['Next Month'].push(task);
      } else {
        sections.Upcoming.push(task);
      }
    });

    return Object.entries(sections)
      .map(([title, data]) => ({
        title,
        data: data.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]),
      }))
      .filter(section => section.data.length > 0);
  };

  const handleLogout = () => {
    signOut(auth).catch(() => Alert.alert('Error', 'Logout failed'));
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>{error}</Text>
      </View>
    );
  }

  const todayFormatted = dayjs().format('dddd, MMMM D');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Tasks</Text>
          <Text style={styles.headerSubtitle}>{todayFormatted}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={20} color="#6200ee" />
        </TouchableOpacity>
      </View>

      <SectionList
        sections={categorizeAndSortTasks(tasks)}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <TaskItem task={item} />}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddTask')}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f6f6f6',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#f6f6f6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  logoutBtn: {
    padding: 6,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 8,
    marginLeft: 16,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    backgroundColor: '#6200ee',
    borderRadius: 30,
    padding: 16,
    elevation: 5,
  },
});

export default TaskListScreen;
