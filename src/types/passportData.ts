import { CertificateData } from 'helpers/parseCertificate/certificate.types';

export type DocumentType = 'passport' | 'mock_passport';

export type PassportData = {
  mrz: string;
  dg1Hash?: number[];
  dg2Hash?: number[];
  dgPresents?: any[];
  dsc: string;
  eContent: number[];
  signedAttr: number[];
  encryptedDigest: number[];
  passportMetadata?: PassportMetadata;
  dsc_parsed?: CertificateData;
  csca_parsed?: CertificateData;
  documentType: DocumentType;
};

export interface PassportMetadata {
  dataGroups: string;
  dg1Size: number;
  dg1HashSize: number;
  dg1HashFunction: string;
  dg1HashOffset: number;
  dgPaddingBytes: number;
  eContentSize: number;
  eContentHashFunction: string;
  eContentHashOffset: number;
  signedAttrSize: number;
  signedAttrHashFunction: string;
  signatureAlgorithm: string;
  saltLength: number;
  curveOrExponent: string;
  signatureAlgorithmBits: number;
  countryCode: string;
  cscaFound: boolean;
  cscaHashFunction: string;
  cscaSignatureAlgorithm: string;
  cscaSaltLength: number;
  cscaCurveOrExponent: string;
  cscaSignatureAlgorithmBits: number;
  dsc: string;
  csca: string;
}

export type PassportTransactionData = {
  nationality: string;
  dateOfBirth: string;
  dateOfExpiry: string;
  documentNumber: string;
  issuingCountry: string;
};

export type SignatureAlgorithm = 'ecdsa_sha512_secp521r1_521';
