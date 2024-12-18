import { TMainStackParams } from 'screens/AppNavigation.types';

export type TNavigationContext = {
  navigationState: TNavigationState;
  navigationDispatch: TNavigationDispatch;
};

export type TNavigationState = {
  initialRouteName: keyof TMainStackParams;
  navigationLoading: boolean;
  initialRouteParams?: TMainStackParams['Introduction'];
  isShowAuthorizedScreens: boolean;
  isShowEmployeeAuthorizedScreens: boolean;
  authDeepLinkUrl?: string;
};

export type TNavigationDispatch = {
  setInitialRouteName: (
    routeName: keyof TMainStackParams,
    params?: TMainStackParams['Introduction']
  ) => void;
  setShowAuthorizedScreens: (showAuthorizedScreens: boolean) => void;
  setShowEmployeeAuthorizedScreens: (showEmployeeAuthorizedScreens: boolean) => void;
  setAuthDeepLinkUrl: (url?: string) => void;
};
