import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  createNavigationContainerRef,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@shopify/restyle';

import { NavigationHeaderBackButton, NavigationHeaderEmptyView } from 'components/Navigation';
import Introduction from 'screens/onboarding/Introduction/Introduction';

import { DEFAULT_STACK_NAVIGATION_OPTIONS, SLIDE_FROM_RIGHT_ANIMATION } from 'theme/navigation';
import { FONT_FAMILY } from 'theme/fonts';

import { TRootStackParams } from './AppNavigation.types';
import useNetInfoHandler from 'hooks/useNetInfoHandler';
import { useThemeContext } from 'context/ThemeProvider';
import NoInternetConnectionToaster from 'components/NoInternetConnectionToaster';
import { getHeaderBlurStyleByTheme } from 'enums/Theme';
import { useNavigationContext } from 'context/NavigationProvider';
import PassportCameraScan from './onboarding/PassportCameraScan';
import getDeviceLanguage from 'helpers/deviceLanguage';
import PassportNfcRead from './onboarding/PassportNfcRead';
import SecurityAttributes from './onboarding/SecurityAttributes';
import History from './home/History';
import ZeroKnowledgeProof from './home/ZeroKnowledgeProof';
import BottomTabBarNavigator from 'components/BottomTabBarNavigator';
import storage, { STORAGE_KEYS } from 'helpers/storage';

export const navigationRef = createNavigationContainerRef();
export const RootStack = createNativeStackNavigator<TRootStackParams>();

function AppNavigation() {
  const { isNetConnected } = useNetInfoHandler();
  const { colors } = useTheme();
  const { i18n } = useTranslation();
  const { navigationDispatch, navigationState } = useNavigationContext();
  const { themeDispatch } = useThemeContext();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    handleAppInitFlow();
  }, []);

  async function handleAppInitFlow() {
    try {
      const locale = await getDeviceLanguage();
      await i18n.changeLanguage(locale);
      await handleAppInitialNavigation();
    } catch (e) {
      await handleAppInitialNavigation();
    }
    setIsInitialized(true);
  }

  async function handleAppInitialNavigation() {
    const walletPhrase = await storage.readStorage(STORAGE_KEYS.WALLET_PHRASE);

    if (walletPhrase) {
      navigationDispatch.setInitialRouteName('Wallet');
      return;
    }
    navigationDispatch.setInitialRouteName('Introduction');
    return;
  }

  if (!isInitialized) {
    return null;
  }

  function renderMainScreens() {
    return (
      <>
        <RootStack.Group
          screenOptions={{
            headerShown: false,
          }}>
          <RootStack.Screen name="Wallet" component={BottomTabBarNavigator} />
        </RootStack.Group>
      </>
    );
  }

  function renderOnboardingScreens() {
    return (
      <RootStack.Group
        screenOptions={{
          headerLeft: NavigationHeaderBackButton,
        }}>
        <RootStack.Screen
          name="Introduction"
          component={Introduction}
          options={{
            headerTitle: NavigationHeaderEmptyView,
            headerLeft: NavigationHeaderEmptyView,
          }}
        />
        <RootStack.Screen
          name="PassportCameraScan"
          component={PassportCameraScan}
          options={{
            headerTitle: NavigationHeaderEmptyView,
            headerLeft: NavigationHeaderEmptyView,
          }}
        />
        <RootStack.Screen
          name="PassportNfcRead"
          component={PassportNfcRead}
          options={{
            headerTitle: NavigationHeaderEmptyView,
          }}
        />
        <RootStack.Screen
          name="SecurityAttributes"
          component={SecurityAttributes}
          options={{
            headerTitle: NavigationHeaderEmptyView,
          }}
        />
      </RootStack.Group>
    );
  }

  function renderHomeScreens() {
    return (
      <>
        <RootStack.Group
          screenOptions={{
            headerShown: false,
          }}>
          <RootStack.Screen name="History" component={History} />
          <RootStack.Screen name="ZeroKnowledgeProof" component={ZeroKnowledgeProof} />
        </RootStack.Group>
      </>
    );
  }

  return (
    <>
      <NavigationContainer
        ref={navigationRef}
        theme={{
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
            background: colors.backgroundPrimary,
          },
        }}>
        <RootStack.Navigator
          screenOptions={{
            ...DEFAULT_STACK_NAVIGATION_OPTIONS,
            animation: SLIDE_FROM_RIGHT_ANIMATION,
            presentation: 'card',
            headerStyle: {
              backgroundColor: colors.backgroundPrimary,
            },
            headerTitleStyle: {
              color: colors.textPrimary,
              fontFamily: FONT_FAMILY.bold,
              fontWeight: '600',
              fontSize: 16,
            },
            headerBlurEffect: getHeaderBlurStyleByTheme(themeDispatch.getThemeValue()),
            navigationBarColor: colors.backgroundPrimary,
          }}
          initialRouteName={navigationState.initialRouteName}>
          {renderMainScreens()}
          {renderOnboardingScreens()}
          {renderHomeScreens()}
        </RootStack.Navigator>
      </NavigationContainer>
      {!isNetConnected && <NoInternetConnectionToaster />}
    </>
  );
}

export default AppNavigation;
