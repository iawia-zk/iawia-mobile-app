import { NOOP } from 'constants/noop';
import { TOnboardingDispatch, TOnboardingState } from './OnboardingProvider.types';

export const INITIAL_STATE: TOnboardingState = {
  passportId: undefined,
  passportData: undefined,
  documentNumber: undefined,
  birthDate: undefined,
  expiryDate: undefined,
};

export const INITIAL_DISPATCH: TOnboardingDispatch = {
  setPassportId: NOOP,
  setPassportData: NOOP,
  clear: NOOP,
};
