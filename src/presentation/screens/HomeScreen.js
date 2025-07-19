import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TaskListScreen from './TaskListScreen';
import AddTaskScreen from './AddTaskScreen';

const TaskStack = createNativeStackNavigator();

const HomeScreen = () => {
  return (
    <TaskStack.Navigator screenOptions={{ headerShown: false }}>
      <TaskStack.Screen name="TaskList" component={TaskListScreen} />
      <TaskStack.Screen name="AddTask" component={AddTaskScreen} />
    </TaskStack.Navigator>
  );
};

export default HomeScreen;