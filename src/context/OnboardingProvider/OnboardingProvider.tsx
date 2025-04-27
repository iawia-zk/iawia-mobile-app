import React, { createContext, ReactElement, useContext, useState } from 'react';

import { TChildrenOnly } from 'types/common';

import { INITIAL_DISPATCH, INITIAL_STATE } from './OnboardingProvider.constants';
import { TOnboardingContext, TOnboardingState } from './OnboardingProvider.types';
import extractMRZInfo from 'helpers/extractMrz';

const onboardingContext = createContext<TOnboardingContext>({
  onboardingState: INITIAL_STATE,
  onboardingDispatch: INITIAL_DISPATCH,
});

function OnboardingProvider({ children }: TChildrenOnly): ReactElement {
  const [state, setState] = useState<TOnboardingState>(INITIAL_STATE);

  function setPassportId(passportId: string) {
    const { documentNumber, birthDate, expiryDate } = extractMRZInfo(passportId);

    setState((prevState) => ({ ...prevState, passportId, documentNumber, birthDate, expiryDate }));
  }

  function setPassportData(passportData: TOnboardingState['passportData']) {
    setState((prevState) => ({ ...prevState, passportData }));
  }

  function setMrzResult(data: TOnboardingState) {
    setState((prevState) => ({ ...prevState, ...data }));
  }

  function clear() {
    setState(INITIAL_STATE);
  }

  const value: TOnboardingContext = {
    onboardingState: state,
    onboardingDispatch: { setPassportId, setPassportData, setMrzResult, clear },
  };

  return <onboardingContext.Provider value={value}>{children}</onboardingContext.Provider>;
}

export default OnboardingProvider;

export const useOnboardingContext = (): TOnboardingContext => useContext(onboardingContext);
