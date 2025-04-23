import { PassportData } from 'hooks/useNFC/useNFC.types';
// TODO: (eren) PassportData no longer means the same thing, look how to refactor this

export type TOnboardingContext = {
  onboardingState: TOnboardingState;
  onboardingDispatch: TOnboardingDispatch;
};

export type TOnboardingState = {
  passportId?: string;
  passportData?: PassportData;
  documentNumber?: string;
  birthDate?: string;
  expiryDate?: string;
};

export type TOnboardingDispatch = {
  setPassportId: (passportId: string) => void;
  setPassportData: (data: PassportData) => void;
  clear: () => void;
};
