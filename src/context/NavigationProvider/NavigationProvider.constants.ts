import { NOOP } from 'constants/noop';

import { TNavigationState, TNavigationDispatch } from './NavigationProvider.types';

export const INITIAL_STATE: TNavigationState = {
  initialRouteName: 'Introduction',
  initialRouteParams: undefined,
  navigationLoading: true,
  isShowAuthorizedScreens: false,
  isShowEmployeeAuthorizedScreens: false,
  authDeepLinkUrl: undefined,
};

export const INITIAL_DISPATCH: TNavigationDispatch = {
  setInitialRouteName: NOOP,
  setShowAuthorizedScreens: NOOP,
  setShowEmployeeAuthorizedScreens: NOOP,
  setAuthDeepLinkUrl: NOOP,
};
