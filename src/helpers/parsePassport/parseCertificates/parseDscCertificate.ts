import { brutforceSignatureAlgorithmDsc } from '../parseSignatures/bruteForceDscSignature';
import { CertificateData } from './parseCertificate.types';
import { parseCertificateSimple } from './parseCertificateSimple';
import { getCSCAFromSKI } from '../../hash/csca';
import { getCurveOrExponent } from '../parsePassportData';

export interface DscCertificateMetaData {
  cscaFound: boolean;
  cscaHashAlgorithm: string;
  cscaSignatureAlgorithm: string;
  cscaCurveOrExponent: string;
  cscaSignatureAlgorithmBits: number;
  cscaSaltLength: number;
  csca: string;
  cscaParsed: CertificateData;
  cscaBits: number;
}

export function parseDscCertificateData(dscCert: CertificateData): DscCertificateMetaData {
  let csca,
    cscaParsed,
    cscaHashAlgorithm,
    cscaSignatureAlgorithm,
    cscaCurveOrExponent,
    cscaSignatureAlgorithmBits,
    cscaSaltLength;

  let cscaFound = false;
  if (dscCert.authorityKeyIdentifier) {
    try {
      csca = getCSCAFromSKI(dscCert.authorityKeyIdentifier, true);
      if (csca) {
        cscaParsed = parseCertificateSimple(csca);
        const details = brutforceSignatureAlgorithmDsc(dscCert, cscaParsed);
        cscaFound = true;
        cscaHashAlgorithm = details.hashAlgorithm;
        cscaSignatureAlgorithm = details.signatureAlgorithm;
        cscaCurveOrExponent = getCurveOrExponent(cscaParsed);
        cscaSignatureAlgorithmBits = parseInt(cscaParsed.publicKeyDetails.bits);
        cscaSaltLength = details.saltLength;
      }
    } catch (error) {}
  } else {
    console.log('js: dscCert.authorityKeyIdentifier not found');
  }
  return {
    cscaFound: cscaFound,
    cscaHashAlgorithm: cscaHashAlgorithm,
    cscaSignatureAlgorithm: cscaSignatureAlgorithm,
    cscaCurveOrExponent: cscaCurveOrExponent,
    cscaSignatureAlgorithmBits: cscaSignatureAlgorithmBits,
    cscaSaltLength: cscaSaltLength,
    csca: csca,
    cscaParsed: cscaParsed,
    cscaBits: cscaSignatureAlgorithmBits,
  };
}
