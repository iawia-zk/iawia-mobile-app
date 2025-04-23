import { PassportData } from '../passportData.types';
import { parseCertificateSimple } from '../parseCertificates/parseCertificateSimple';
import { PublicKeyDetailsECDSA } from '../parseCertificates/parseCertificate.types';
import * as asn1js from 'asn1js';
import { initElliptic } from '../../ellipticCurves/parseElliptic';
import { getCurveForElliptic } from '../../ellipticCurves/ellipticCurves';
import { Certificate } from 'pkijs';
import { hashAlgos } from 'constants/hash';
import { hash } from '../../hash/hash';

export function brutforceSignatureAlgorithm(passportData: PassportData) {
  const parsedDsc = parseCertificateSimple(passportData.dsc);
  if (parsedDsc.signatureAlgorithm === 'ecdsa') {
    const hashAlgorithm = brutforceHashAlgorithm(passportData, 'ecdsa');
    return {
      signatureAlgorithm: 'ecdsa',
      hashAlgorithm: hashAlgorithm,
      saltLength: 0,
    };
  }
  console.log('Signature algorithm not supported');
  return false;
}

function brutforceHashAlgorithm(
  passportData: PassportData,
  signatureAlgorithm: string,
  saltLength?: number
): any {
  for (const hashFunction of hashAlgos) {
    if (verifySignature(passportData, signatureAlgorithm, hashFunction, saltLength)) {
      return hashFunction;
    }
  }
  return false;
}

export function verifySignature(
  passportData: PassportData,
  signatureAlgorithm: string,
  hashAlgorithm: string,
  saltLength: number = 0
): boolean {
  switch (signatureAlgorithm) {
    case 'ecdsa':
      return verifyECDSA(passportData, hashAlgorithm);
    default:
      console.log('Signature algorithm not supported');
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
