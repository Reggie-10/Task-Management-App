import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store/store'; // ✅ your Redux store

import { Navigation } from './src/infrastructure/navigation';
import { AuthenticationContextProvider } from './src/services/authentication/authentication.context';

import { useFonts as useOswald, Oswald_400Regular } from '@expo-google-fonts/oswald';
import { useFonts as useLato, Lato_400Regular } from '@expo-google-fonts/lato';

import { en, registerTranslation } from 'react-native-paper-dates';

// ✅ Register English locale
registerTranslation('en', en);

export default function App() {
  return (
    <Provider store={store}>
      <AuthenticationContextProvider>
        <Navigation />
        <ExpoStatusBar style="auto" />
      </AuthenticationContextProvider>
    </Provider>
  );
}
