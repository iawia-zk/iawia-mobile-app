import { NOOP } from 'constants/noop';
import { TOnboardingDispatch, TOnboardingState } from './OnboardingProvider.types';

export const INITIAL_STATE: TOnboardingState = {
  passportId: undefined,
  passportData: undefined,
  passportTransactionData: undefined,
  documentNumber: undefined,
  birthDate: undefined,
  expiryDate: undefined,
};

export const INITIAL_DISPATCH: TOnboardingDispatch = {
  setPassportId: NOOP,
  setPassportData: NOOP,
  setPassportTransactionData: NOOP,
  setMrzResult: NOOP,
  clear: NOOP,
};
