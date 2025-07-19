import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthenticationContext } from '../../services/authentication/authentication.context';

import LoginScreen from '../../presentation/screens/LoginScreen';
import RegisterScreen from '../../presentation/screens/RegisterScreen';
import HomeScreen from '../../presentation/screens/HomeScreen';

const Stack = createNativeStackNavigator();

export const Navigation = () => {
  const { user } = useContext(AuthenticationContext);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Home" component={HomeScreen} />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
