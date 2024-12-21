import React, { useEffect } from 'react';
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import {
  createNavigationContainerRef,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@shopify/restyle';

import {
  NavigationHeaderBackButton,
  NavigationHeaderEmptyView,
  NavigationHeaderCancelButton,
} from 'components/Navigation';
import Box from 'components/core/Box';
import Introduction from 'screens/Onboarding/Introduction/Introduction';

import {
  DEFAULT_STACK_NAVIGATION_OPTIONS,
  MODAL_SLIDE_FROM_BOTTOM,
  SLIDE_FROM_RIGHT_ANIMATION,
} from 'theme/navigation';
import { FONT_FAMILY } from 'theme/fonts';

import { TRootStackParams } from './AppNavigation.types';
import useNetInfoHandler from 'hooks/useNetInfoHandler';
import { useThemeContext } from 'context/ThemeProvider';
import NoInternetConnectionToaster from 'components/NoInternetConnectionToaster';
import { getHeaderBlurStyleByTheme } from 'enums/Theme';
import { useNavigationContext } from 'context/NavigationProvider';
import PassportIdScan from './Onboarding/PassportIdScan';
import getDeviceLanguage from 'helpers/deviceLanguage';

export const navigationRef = createNavigationContainerRef();
export const RootStack = createNativeStackNavigator<TRootStackParams>();

function AppNavigation() {
  const { isNetConnected } = useNetInfoHandler();
  const { colors } = useTheme();
  const { i18n } = useTranslation();
  const { navigationDispatch, navigationState } = useNavigationContext();
  const { themeDispatch } = useThemeContext();

  useEffect(() => {
    handleAppInitFlow();
  }, []);

  async function handleAppInitFlow() {
    try {
      const locale = await getDeviceLanguage();
      await i18n.changeLanguage(locale);
      return navigationDispatch.setInitialRouteName('Introduction');
    } catch (e) {
      return navigationDispatch.setInitialRouteName('Introduction');
    }
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
          name="PassportIdScan"
          component={PassportIdScan}
          options={{
            title: t('label.selectCountry'),
          }}
        />
        <RootStack.Screen
          name="PassportNfcRead"
          component={Box}
          options={{
            headerTitle: NavigationHeaderEmptyView,
          }}
        />
        <RootStack.Screen
          name="SecurityAttributes"
          component={Box}
          options={{
            headerTitle: NavigationHeaderEmptyView,
            headerLeft: NavigationHeaderEmptyView,
            headerRight: NavigationHeaderCancelButton,
            ...MODAL_SLIDE_FROM_BOTTOM,
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
          <RootStack.Screen name="Wallet" component={Box} />
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
          {renderOnboardingScreens()}
          {renderHomeScreens()}
        </RootStack.Navigator>
      </NavigationContainer>
      {!isNetConnected && <NoInternetConnectionToaster />}
    </>
  );
}

export default AppNavigation;
