import { create } from 'zustand';

interface UserState {
  passportNumber: string;
  dateOfBirth: string;
  dateOfExpiry: string;
  update: (patch: any) => void;
  deleteMrzFields: () => void;
}

const useUserInfo = create<UserState>((set, get) => ({
  passportNumber: '',
  dateOfBirth: '',
  dateOfExpiry: '',

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
    }),
}));

export default useUserInfo;
