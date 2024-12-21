import React, { ReactElement } from 'react';

import ThemeProvider from 'context/ThemeProvider';
import AppNavigation from 'screens/AppNavigation';
import NavigationProvider from 'context/NavigationProvider';

import 'configs/i18n';

function App(): ReactElement {
  return (
    <ThemeProvider>
      <NavigationProvider>
        <AppNavigation />
      </NavigationProvider>
    </ThemeProvider>
  );
}

export default App;
