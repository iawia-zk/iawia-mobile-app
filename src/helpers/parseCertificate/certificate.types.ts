import { StandardCurve } from '../elliptic/curves';

export interface CertificateData {
  id: string;
  issuer: string;
  validity: {
    notBefore: string;
    notAfter: string;
  };
  subjectKeyIdentifier: string;
  authorityKeyIdentifier: string;
  signatureAlgorithm: string;
  hashAlgorithm: string;
  publicKeyDetails: PublicKeyDetailsECDSA | undefined;
  tbsBytes: number[] | undefined;
  tbsBytesLength: string;
  rawPem: string;
  rawTxt: string;
  publicKeyAlgoOID?: string;
}

export interface PublicKeyDetailsECDSA {
  x: string;
  y: string;
  curve: string;
  params: StandardCurve;
  bits: string;
}
