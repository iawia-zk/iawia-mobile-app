export type PassportData = {};
// TODO: Define the structure of PassportData

export type PassportTransactionData = {
  nationality: string;
  dateOfBirth: string;
  dateOfExpiry: string;
  documentNumber: string;
  placeOfBirth: string;
  issuingCountry: string;
};

export type SignatureAlgorithm = 'ecdsa_sha512_secp521r1_521';
