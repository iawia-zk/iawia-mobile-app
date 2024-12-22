import React, { ReactElement } from 'react';

import ThemeProvider from 'context/ThemeProvider';
import AppNavigation from 'screens/AppNavigation';
import NavigationProvider from 'context/NavigationProvider';

import 'configs/i18n';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import OnboardingProvider from 'context/OnboardingProvider';

function App(): ReactElement {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <OnboardingProvider>
          <NavigationProvider>
            <AppNavigation />
          </NavigationProvider>
        </OnboardingProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;
