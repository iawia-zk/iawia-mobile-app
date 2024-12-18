import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TOnboardingScreensParams } from './onboarding/OnboardingNavigation.types';
import { THomeScreensParams } from './home/HomeNavigation.types';

// import { TAccountsReceivableScreensParams } from 'screens/AccountsReceivable/AccountsReceivableNavigation.types';

export type TMainStackParams = TOnboardingScreensParams & THomeScreensParams;

export type TRootStackParams = {
  Main: NavigatorScreenParams<TMainStackParams>;
} & TMainStackParams;

export type TNavigationProps<T extends keyof TRootStackParams> = NativeStackScreenProps<
  TRootStackParams,
  T
>;
