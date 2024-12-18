import React, { createContext, ReactElement, useContext, useState } from 'react';

import { TChildrenOnly } from 'types/common';
import { TMainStackParams } from 'screens/AppNavigation.types';

import { INITIAL_DISPATCH, INITIAL_STATE } from './NavigationProvider.constants';
import { TNavigationState, TNavigationContext } from './NavigationProvider.types';

const navigationContext = createContext<TNavigationContext>({
  navigationState: INITIAL_STATE,
  navigationDispatch: INITIAL_DISPATCH,
});

function NavigationProvider({ children }: TChildrenOnly): ReactElement {
  const [
    {
      initialRouteName,
      initialRouteParams,
      isShowAuthorizedScreens,
      isShowEmployeeAuthorizedScreens,
      navigationLoading,
      authDeepLinkUrl,
    },
    setState,
  ] = useState<TNavigationState>(INITIAL_STATE);

  function setInitialRouteName(
    routeName: keyof TMainStackParams,
    params?: TMainStackParams['Introduction']
  ) {
    setState((state) => ({
      ...state,
      initialRouteName: routeName,
      initialRouteParams: params,
      navigationLoading: false,
    }));
  }

  function setShowAuthorizedScreens(showAuthorizedScreens: boolean) {
    setState((state) => ({
      ...state,
      isShowAuthorizedScreens: showAuthorizedScreens,
    }));
  }

  function setShowEmployeeAuthorizedScreens(showEmployeeAuthorizedScreens: boolean) {
    setState((state) => ({
      ...state,
      isShowAuthorizedScreens: showEmployeeAuthorizedScreens,
      isShowEmployeeAuthorizedScreens: showEmployeeAuthorizedScreens,
    }));
  }

  function setAuthDeepLinkUrl(authDeepLinkUrlValue?: string) {
    setState((state) => ({
      ...state,
      authDeepLinkUrl: authDeepLinkUrlValue,
    }));
  }

  const value: TNavigationContext = {
    navigationState: {
      initialRouteName,
      initialRouteParams,
      isShowEmployeeAuthorizedScreens,
      isShowAuthorizedScreens,
      navigationLoading,
      authDeepLinkUrl,
    },
    navigationDispatch: {
      setInitialRouteName,
      setShowAuthorizedScreens,
      setShowEmployeeAuthorizedScreens,
      setAuthDeepLinkUrl,
    },
  };

  return <navigationContext.Provider value={value}>{children}</navigationContext.Provider>;
}

export default NavigationProvider;

export const useNavigationContext = (): TNavigationContext => useContext(navigationContext);
