export type PassportData = {
  firstName: string;
  gender: string;
  issuer: string;
  lastName: string;
  nationality: string;
  photo: {
    base64: string;
    width: number;
    height: number;
  };
};
