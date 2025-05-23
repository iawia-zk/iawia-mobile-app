import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '@shopify/restyle';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Text from 'components/core/Text';

import { useThemeContext } from 'context/ThemeProvider';
import { DEFAULT_STACK_NAVIGATION_OPTIONS } from 'theme/navigation';
import { getHeaderBlurStyleByTheme } from 'enums/Theme';
import { FONT_FAMILY } from 'theme/fonts';
import spacing from 'theme/spacing';

import { TTabBarIconParams } from './BottomTabBarNavigator.types';
import { TAB_BAR_HEIGHT } from './BottomTabBarNavigator.constants';
import History from 'screens/home/History';
import ZeroKnowledgeProof from 'screens/home/ZeroKnowledgeProof';
import { IdIcon, User01Icon, WalletIcon } from 'components/Icons';
import Wallet from 'screens/home/Wallet';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function BottomTabBarNavigator() {
  const { colors } = useTheme();
  const { bottom: bottomInset } = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName="WalletStack"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: colors.backgroundPrimary,
          borderTopColor: colors.borderDivider,
          height: TAB_BAR_HEIGHT + bottomInset,
          paddingTop: bottomInset > 0 ? spacing.xs : spacing.none,
        },
        tabBarLabelPosition: 'below-icon',
      }}>
      <Tab.Screen
        name="WalletStack"
        component={WalletStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }: TTabBarIconParams) => (
            <WalletIcon iconColor={focused ? 'textActive' : 'textSecondary'} />
          ),
          tabBarLabel: ({ focused }: TTabBarIconParams) => (
            <Text
              textId="label.wallet"
              color={focused ? 'textActive' : 'textSecondary'}
              variant={focused ? 'textBodySmallBold' : 'textBodySmall'}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ZKProofStack"
        component={ZKProofStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }: TTabBarIconParams) => (
            <IdIcon iconColor={focused ? 'textActive' : 'textSecondary'} />
          ),
          tabBarLabel: ({ focused }: TTabBarIconParams) => (
            <Text
              textId="label.zkProof"
              color={focused ? 'textActive' : 'textSecondary'}
              variant={focused ? 'textBodySmallBold' : 'textBodySmall'}
            />
          ),
        }}
      />
      <Tab.Screen
        name="HistoryStack"
        component={HistoryStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }: TTabBarIconParams) => (
            <User01Icon iconColor={focused ? 'textActive' : 'textSecondary'} />
          ),
          tabBarLabel: ({ focused }: TTabBarIconParams) => (
            <Text
              textId="label.history"
              color={focused ? 'textActive' : 'textSecondary'}
              variant={focused ? 'textBodySmallBold' : 'textBodySmall'}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function WalletStack() {
  const { colors } = useTheme();
  const { themeDispatch } = useThemeContext();

  return (
    <Stack.Navigator
      screenOptions={{
        ...DEFAULT_STACK_NAVIGATION_OPTIONS,
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
      }}>
      <Stack.Screen name="Wallet" component={Wallet as any} />
    </Stack.Navigator>
  );
}

function ZKProofStack() {
  const { colors } = useTheme();
  const { themeDispatch } = useThemeContext();
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={{
        ...DEFAULT_STACK_NAVIGATION_OPTIONS,
        headerStyle: {
          backgroundColor: colors.backgroundPrimary,
        },
        headerBlurEffect: getHeaderBlurStyleByTheme(themeDispatch.getThemeValue()),
        headerTitleStyle: {
          color: colors.textPrimary,
          fontFamily: FONT_FAMILY.bold,
          fontWeight: '600',
          fontSize: 16,
        },
      }}>
      <Stack.Screen
        name="ZeroKnowledgeProof"
        component={ZeroKnowledgeProof as any}
        options={{
          headerTitle: t('label.zkProof'),
        }}
      />
    </Stack.Navigator>
  );
}

function HistoryStack() {
  const { colors } = useTheme();
  const { themeDispatch } = useThemeContext();
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={{
        ...DEFAULT_STACK_NAVIGATION_OPTIONS,
        headerStyle: {
          backgroundColor: colors.backgroundPrimary,
        },
        headerBlurEffect: getHeaderBlurStyleByTheme(themeDispatch.getThemeValue()),
        headerTitleStyle: {
          color: colors.textPrimary,
          fontFamily: FONT_FAMILY.bold,
          fontWeight: '600',
          fontSize: 16,
        },
      }}>
      <Stack.Screen
        name="History"
        component={History as any}
        options={{
          headerTitle: t('label.history'),
        }}
      />
    </Stack.Navigator>
  );
}

export default BottomTabBarNavigator;
