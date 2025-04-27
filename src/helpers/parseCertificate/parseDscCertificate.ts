import { bruteforceSignatureAlgorithmDsc } from './bruteForceDscSignature';
import { CertificateData } from '../parseCertificate/certificate.types';
import { parseCertificateSimple } from '../parseCertificate/parseCertificateSimple';
import { getCSCAFromSKI } from '../hash/csca';
import { getCurveOrExponent } from '../parsePassport/parsePassport';

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
        const details = bruteforceSignatureAlgorithmDsc(dscCert, cscaParsed);
        cscaFound = true;
        cscaHashAlgorithm = details.hashAlgorithm;
        cscaSignatureAlgorithm = details.signatureAlgorithm;
        cscaCurveOrExponent = getCurveOrExponent(cscaParsed);
        cscaSignatureAlgorithmBits = parseInt(cscaParsed.publicKeyDetails.bits, 10);
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
