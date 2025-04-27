import * as asn1js from 'asn1js';
import { PassportData } from 'types/passportData';
import { parseCertificateSimple } from '../parseCertificate/parseCertificateSimple';
import { PublicKeyDetailsECDSA } from '../parseCertificate/certificate.types';
import { initElliptic } from '../elliptic/elliptic';
import { getCurveForElliptic } from '../elliptic/curves';
import { Certificate } from 'pkijs';
import { hashAlgos } from 'constants/circuits';
import { hash } from '../hash/hash';

export function brutforceSignatureAlgorithm(passportData: PassportData) {
  const parsedDsc = parseCertificateSimple(passportData.dsc);
  if (parsedDsc.signatureAlgorithm === 'ecdsa') {
    const hashAlgorithm = brutforceHashAlgorithm(passportData, 'ecdsa');
    return {
      signatureAlgorithm: 'ecdsa',
      hashAlgorithm: hashAlgorithm,
      saltLength: 0,
    };
  } else {
    console.warn('Only ECDSA is supported for DSC');
    return {
      signatureAlgorithm: 'unknown',
      hashAlgorithm: 'unknown',
    };
  }
}

function brutforceHashAlgorithm(passportData: PassportData, signatureAlgorithm: string): any {
  for (const hashFunction of hashAlgos) {
    if (verifySignature(passportData, signatureAlgorithm, hashFunction)) {
      return hashFunction;
    }
  }
  return false;
}

export function verifySignature(
  passportData: PassportData,
  signatureAlgorithm: string,
  hashAlgorithm: string
): boolean {
  switch (signatureAlgorithm) {
    case 'ecdsa':
      return verifyECDSA(passportData, hashAlgorithm);
    default:
      return false;
  }
}

function verifyECDSA(passportData: PassportData, hashAlgorithm: string) {
  const elliptic = initElliptic();
  const { dsc, signedAttr, encryptedDigest } = passportData;
  const { publicKeyDetails } = parseCertificateSimple(dsc);
  const certBuffer = Buffer.from(
    dsc.replace(/(-----(BEGIN|END) CERTIFICATE-----|\n)/g, ''),
    'base64'
  );
  const asn1Data = asn1js.fromBER(certBuffer);
  const cert = new Certificate({ schema: asn1Data.result });
  const publicKeyInfo = cert.subjectPublicKeyInfo;
  const publicKeyBuffer = publicKeyInfo.subjectPublicKey.valueBlock.valueHexView;
  const curveForElliptic = getCurveForElliptic((publicKeyDetails as PublicKeyDetailsECDSA).curve);
  const ec = new elliptic.ec(curveForElliptic);

  const key = ec.keyFromPublic(publicKeyBuffer);
  const msgHash = hash(hashAlgorithm, signedAttr, 'hex');
  const signature_crypto = Buffer.from(encryptedDigest).toString('hex');

  return key.verify(msgHash, signature_crypto);
}
