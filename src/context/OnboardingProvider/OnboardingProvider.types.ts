import { MrzResult } from 'helpers/extractMrz/extractMrz.types';
import { PassportData, PassportTransactionData } from 'types/passportData';

export type TOnboardingContext = {
  onboardingState: TOnboardingState;
  onboardingDispatch: TOnboardingDispatch;
};

export type TOnboardingState = {
  mrz?: string;
  passportId?: string;
  passportData?: PassportData;
  passportTransactionData?: PassportTransactionData;
} & MrzResult;

export type TOnboardingDispatch = {
  setPassportId: (passportId: string) => void;
  setPassportData: (data: PassportData) => void;
  setPassportTransactionData: (data: PassportTransactionData) => void;
  setMrzResult(data: MrzResult): void;
  clear: () => void;
};
