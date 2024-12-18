import React, { ReactElement } from 'react';
import { SafeAreaView } from 'react-native';

import ThemeProvider from 'context/ThemeProvider';
import AppNavigation from 'screens/AppNavigation';

function App(): ReactElement {
  return (
    <SafeAreaView>
      <AppNavigation />
      <ThemeProvider />
    </SafeAreaView>
  );
}

export default App;
