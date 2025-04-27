import { PassportMetadata } from 'helpers/passport_parsing/parsePassportData';

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
