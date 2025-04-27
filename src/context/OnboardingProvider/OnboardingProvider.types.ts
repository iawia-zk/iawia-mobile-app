import { MrzResult } from 'helpers/extractMrz/extractMrz.types';
import { PassportData } from 'hooks/useNFC/useNFC.types';

export type TOnboardingContext = {
  onboardingState: TOnboardingState;
  onboardingDispatch: TOnboardingDispatch;
};

export type TOnboardingState = {
  passportId?: string;
  passportData?: PassportData;
} & MrzResult;

export type TOnboardingDispatch = {
  setPassportId: (passportId: string) => void;
  setPassportData: (data: PassportData) => void;
  setMrzResult(data: MrzResult): void;
  clear: () => void;
};
