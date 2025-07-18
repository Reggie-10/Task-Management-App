import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, FAB, Appbar } from 'react-native-paper';
import { signOut } from 'firebase/auth';
import { auth } from '../../data/firebase/firebase';

export default function HomeScreen() {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Tasks" />
        <Appbar.Action icon="logout" onPress={handleLogout} />
      </Appbar.Header>

      <View style={styles.container}>
        <Text>Welcome! Your tasks will be listed here.</Text>
      </View>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => {
          // Later: navigate to AddTaskScreen
          console.log("FAB Pressed");
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16
  }
});
