import * as asn1js from 'asn1js';
import { hashAlgos } from 'constants/circuits';
import { CertificateData, PublicKeyDetailsECDSA } from '../parseCertificate/certificate.types';
import { initElliptic } from '../elliptic/elliptic';
import { getCurveForElliptic } from '../elliptic/curves';
import { Certificate } from 'pkijs';
import { hash } from '../hash/hash';

export function bruteforceSignatureAlgorithmDsc(dsc: CertificateData, csca: CertificateData) {
  if (csca.signatureAlgorithm === 'ecdsa') {
    const hashAlgorithm = brutforceHashAlgorithmDsc(dsc, csca, 'ecdsa');
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

function brutforceHashAlgorithmDsc(
  dsc: CertificateData,
  csca: CertificateData,
  signatureAlgorithm: string
): any {
  for (const hashFunction of hashAlgos) {
    if (verifySignature(dsc, csca, signatureAlgorithm, hashFunction)) {
      // console.log(`✓ Success with hash function: ${hashFunction}, signatureAlgorithm: ${signatureAlgorithm}, saltLength: ${saltLength}`);
      return hashFunction;
    }
    // console.log(`✗ Failed with hash function: ${hashFunction}, signatureAlgorithm: ${signatureAlgorithm}, saltLength: ${saltLength}`);
  }
  return false;
}

function verifySignature(
  dsc: CertificateData,
  csca: CertificateData,
  signatureAlgorithm: string,
  hashAlgorithm: string
): boolean {
  switch (signatureAlgorithm) {
    case 'ecdsa':
      return verifyECDSA(dsc, csca, hashAlgorithm);
    default:
      return false;
  }
}

function verifyECDSA(dsc: CertificateData, csca: CertificateData, hashAlgorithm: string): boolean {
  const elliptic = initElliptic();
  const certBuffer_csca = Buffer.from(
    csca.rawPem.replace(/(-----(BEGIN|END) CERTIFICATE-----|\n)/g, ''),
    'base64'
  );
  const asn1Data_csca = asn1js.fromBER(certBuffer_csca);
  const cert_csca = new Certificate({ schema: asn1Data_csca.result });
  const publicKeyInfo_csca = cert_csca.subjectPublicKeyInfo;
  const publicKeyBuffer_csca = publicKeyInfo_csca.subjectPublicKey.valueBlock.valueHexView;
  const curveForElliptic_csca = getCurveForElliptic(
    (csca.publicKeyDetails as PublicKeyDetailsECDSA).curve
  );
  const ec_csca = new elliptic.ec(curveForElliptic_csca);
  const key_csca = ec_csca.keyFromPublic(publicKeyBuffer_csca);

  const tbsHash = getTBSHash(dsc.rawPem, hashAlgorithm, 'hex');

  const certBuffer_dsc = Buffer.from(
    dsc.rawPem.replace(/(-----(BEGIN|END) CERTIFICATE-----|\n)/g, ''),
    'base64'
  );
  const asn1Data_dsc = asn1js.fromBER(certBuffer_dsc);
  const cert_dsc = new Certificate({ schema: asn1Data_dsc.result });
  const signatureValue = cert_dsc.signatureValue.valueBlock.valueHexView;
  const signature_crypto = Buffer.from(signatureValue).toString('hex');
  return key_csca.verify(tbsHash, signature_crypto);
}

export function getTBSHash(
  pem: string,
  hashFunction: string,
  format: 'hex' | 'data' = 'data'
): string {
  const certBuffer = Buffer.from(
    pem.replace(/(-----(BEGIN|END) CERTIFICATE-----|\n)/g, ''),
    'base64'
  );
  const asn1Data_cert = asn1js.fromBER(certBuffer);
  const cert = new Certificate({ schema: asn1Data_cert.result });
  const tbsAsn1 = cert.encodeTBS();
  const tbsDer = tbsAsn1.toBER(false);
  const tbsBytes = Buffer.from(tbsDer);
  const tbsBytesArray = Array.from(tbsBytes);
  const msgHash = hash(hashFunction, tbsBytesArray, format === 'hex' ? 'hex' : 'binary');
  return msgHash as string;
}
