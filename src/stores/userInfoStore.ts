import { create } from 'zustand';

interface UserInfo {
  passportNumber: string;
  dateOfBirth: string;
  dateOfExpiry: string;
  nationality: string;
  issuingCountry: string;
  update: (patch: any) => void;
  deleteMrzFields: () => void;
}

const useUserInfoStore = create<UserInfo>((set, get) => ({
  passportNumber: '',
  dateOfBirth: '',
  dateOfExpiry: '',
  nationality: '',
  issuingCountry: '',

  update: (patch) => {
    set({
      ...get(),
      ...patch,
    });
  },

  deleteMrzFields: () =>
    set({
      passportNumber: '',
      dateOfBirth: '',
      dateOfExpiry: '',
      nationality: '',
      issuingCountry: '',
    }),
}));

export default useUserInfoStore;
