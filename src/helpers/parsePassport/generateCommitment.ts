import { poseidon5 } from 'poseidon-lite';
import { CertificateData, PublicKeyDetailsECDSA } from './parseCertificates/parseCertificate.types';
import {
  getCertificateFromPem,
  parseCertificateSimple,
} from './parseCertificates/parseCertificateSimple';
import { parsePassportData } from './parsePassportData';
import { sha384_512Pad } from '../hash/shaPad';
import { PassportData, SignatureAlgorithm } from './passportData.types';
import { hash, packBytesAndPoseidon } from '../hash/hash';
import { hexToDecimal, splitToWords } from '../hash/bytes';
import * as forge from 'node-forge';
import { n_dsc, k_dsc, n_dsc_ecdsa, k_dsc_ecdsa, n_csca, k_csca } from '../../constants/hash';
import { formatMrz } from '../hash/format';
import { findStartIndexEC } from '../hash/csca';
import { getLeafDscTree } from '../trees/trees';
import { assert, unreachable } from '../assertions/assertions';

/// @dev will bruteforce passport and dsc signature
export function initPassportDataParsing(passportData: PassportData) {
  const passportMetadata = parsePassportData(passportData);
  passportData.passportMetadata = passportMetadata;
  const dscParsed = parseCertificateSimple(passportData.dsc);
  passportData.dsc_parsed = dscParsed;
  if (passportData.passportMetadata.csca) {
    const cscaParsed = parseCertificateSimple(passportData.passportMetadata.csca);
    passportData.csca_parsed = cscaParsed;
  }
  return passportData;
}

export function generateCommitment(
  secret: string,
  attestation_id: string,
  passportData: PassportData
) {
  const passportMetadata = passportData.passportMetadata;

  const dg1_packed_hash = packBytesAndPoseidon(formatMrz(passportData.mrz));

  const eContent_shaBytes = hash(
    passportMetadata.eContentHashFunction,
    Array.from(passportData.eContent),
    'bytes'
  );

  const eContent_packed_hash = packBytesAndPoseidon(
    (eContent_shaBytes as number[]).map((byte) => byte & 0xff)
  );

  const dsc_hash = getLeafDscTree(passportData.dsc_parsed, passportData.csca_parsed);

  return poseidon5([
    secret,
    attestation_id,
    dg1_packed_hash,
    eContent_packed_hash,
    dsc_hash,
  ]).toString();
}

export function generateNullifier(passportData: PassportData) {
  const signedAttr_shaBytes = hash(
    passportData.passportMetadata.signedAttrHashFunction,
    Array.from(passportData.signedAttr),
    'bytes'
  );
  const signedAttr_packed_hash = packBytesAndPoseidon(
    (signedAttr_shaBytes as number[]).map((byte) => byte & 0xff)
  );
  return signedAttr_packed_hash;
}

/// @dev we hardcode the hash function to sha384-512
export function pad() {
  return sha384_512Pad;
}

export function padWithZeroes(bytes: number[], length: number) {
  return bytes.concat(new Array(length - bytes.length).fill(0));
}

/// @notice Get the signature of the passport and the public key of the DSC
/// @dev valid for only for the passport/dsc chain
export function getPassportSignatureInfos(passportData: PassportData) {
  const passportMetadata = passportData.passportMetadata;
  const signatureAlgorithmFullName = getSignatureAlgorithmFullName(
    passportData.dsc_parsed,
    passportMetadata.signatureAlgorithm,
    passportMetadata.signedAttrHashFunction
  );
  const { n, k } = getNAndK(signatureAlgorithmFullName as SignatureAlgorithm);

  return {
    pubKey: getCertificatePubKey(
      passportData.dsc_parsed,
      passportMetadata.signatureAlgorithm,
      passportMetadata.signedAttrHashFunction
    ),
    signature: getPassportSignature(passportData, n, k),
    signatureAlgorithmFullName: signatureAlgorithmFullName,
  };
}

function getPassportSignature(passportData: PassportData, n: number, k: number): any {
  const { signatureAlgorithm } = passportData.dsc_parsed;
  if (signatureAlgorithm === 'ecdsa') {
    const { r, s } = extractRSFromSignature(passportData.encryptedDigest);
    const signature_r = splitToWords(BigInt(hexToDecimal(r)), n, k);
    const signature_s = splitToWords(BigInt(hexToDecimal(s)), n, k);
    return [...signature_r, ...signature_s];
  }
  unreachable('We only support ECDSA for now');
}

/// @notice Get the public key from the certificate
/// @dev valid for both DSC and CSCA
export function getCertificatePubKey(
  certificateData: CertificateData,
  signatureAlgorithm: string,
  hashFunction: string
): any {
  const signatureAlgorithmFullName = getSignatureAlgorithmFullName(
    certificateData,
    signatureAlgorithm,
    hashFunction
  );
  const { n, k } = getNAndK(signatureAlgorithmFullName as SignatureAlgorithm);
  const { publicKeyDetails } = certificateData;
  if (signatureAlgorithm === 'ecdsa') {
    const { x, y } = publicKeyDetails as PublicKeyDetailsECDSA;
    const x_dsc = splitToWords(BigInt(hexToDecimal(x)), n, k);
    const y_dsc = splitToWords(BigInt(hexToDecimal(y)), n, k);
    return [...x_dsc, ...y_dsc];
  }
  unreachable('We only support ECDSA for now');
}

/// @notice Get the public key from the certificate padded as per the DSC circuit's requirements.
export function formatCertificatePubKeyDSC(
  certificateData: CertificateData,
  signatureAlgorithm: string
): string[] {
  const { publicKeyDetails } = certificateData;
  if (signatureAlgorithm === 'ecdsa') {
    const { x, y } = publicKeyDetails as PublicKeyDetailsECDSA;
    // const normalizedX = x.length % 2 === 0 ? x : '0' + x;
    // const normalizedY = y.length % 2 === 0 ? y : '0' + y;
    const fullPubKey = x + y;

    // Splits to 525 words of 8 bits each
    return splitToWords(BigInt(hexToDecimal(fullPubKey)), 8, 525);
  }
  unreachable('We only support ECDSA for now');
}

export function extractSignatureFromDSC(dscCertificate: string) {
  const cert = getCertificateFromPem(dscCertificate);
  const dscSignature = cert.signatureValue.valueBlock.valueHexView;
  return Array.from(forge.util.createBuffer(dscSignature).getBytes(), (char) => char.charCodeAt(0));
}

export function formatSignatureDSCCircuit(
  cscaSignatureAlgorithm: string,
  cscaHashFunction: string,
  cscaCertificateData: CertificateData,
  signature: number[]
): string[] {
  const cscaSignatureAlgorithmFullName = getSignatureAlgorithmFullName(
    cscaCertificateData,
    cscaSignatureAlgorithm,
    cscaHashFunction
  );
  const { n, k } = getNAndK(cscaSignatureAlgorithmFullName as SignatureAlgorithm);
  if (cscaSignatureAlgorithm === 'ecdsa') {
    const { r, s } = extractRSFromSignature(signature);
    const signature_r = splitToWords(BigInt(hexToDecimal(r)), n, k);
    const signature_s = splitToWords(BigInt(hexToDecimal(s)), n, k);
    return [...signature_r, ...signature_s];
  }
  unreachable('We only support ECDSA for now');
}

export function findStartPubKeyIndex(
  certificateData: CertificateData,
  rawCert: any,
  signatureAlgorithm: string
): [number, number] {
  const { publicKeyDetails } = certificateData;
  if (signatureAlgorithm === 'ecdsa') {
    const { x, y } = publicKeyDetails as PublicKeyDetailsECDSA;
    const [x_index, x_totalLength] = findStartIndexEC(x, rawCert);
    const [y_index, y_totalLength] = findStartIndexEC(y, rawCert);

    //zero between x and y
    const pad_between_x_y = y_index - x_index - x_totalLength;
    return [x_index, x_totalLength + pad_between_x_y + y_totalLength];
  }
  unreachable('We only support ECDSA for now');
}

/// @notice Get the signature algorithm full name
/// @dev valid for both DSC and CSCA
export function getSignatureAlgorithmFullName(
  certificateData: CertificateData,
  signatureAlgorithm: string,
  hashAlgorithm: string
): string {
  const { publicKeyDetails } = certificateData;
  if (signatureAlgorithm === 'ecdsa') {
    return `${signatureAlgorithm}_${hashAlgorithm}_${
      (publicKeyDetails as PublicKeyDetailsECDSA).curve
    }_${publicKeyDetails.bits}`;
  }
  unreachable('We only support ECDSA for now');
}

/*** retrieve pubKey bytes - will be used in generateCircuitsInputsCSCA ***/
export function getPubKeyBytes(passportData: PassportData, type: 'dsc' | 'csca'): number[] {
  if (type === 'dsc') {
    return getDscPubKeyBytes(passportData);
  } else if (type === 'csca') {
    return getCscaPubKeyBytes(passportData);
  } else {
    unreachable('Invalid type');
  }
}

function getDscPubKeyBytes(passportData: PassportData): number[] {
  const signatureAlgorithm = passportData.passportMetadata.signatureAlgorithm;
  if (signatureAlgorithm === 'ecdsa') {
    return getECDSAPubKeyBytes(passportData.dsc_parsed);
  }
  unreachable('We only support ECDSA for now');
}

// function getCscaPubKeyBytes(passportData: PassportData): number[] {
//   if (!passportData.passportMetadata.cscaFound) {
//     throw new Error('CSCA not found');
//   }
//   const signatureAlgorithm = passportData.passportMetadata.cscaSignatureAlgorithm;
//   if (signatureAlgorithm === 'ecdsa') {
//     throw new Error('ECDSA signature algorithm not supported for CSCA');
//   }
//   return getRsaPubKeyBytes(passportData.dsc);
// }

function getECDSAPubKeyBytes(parsedCertificate: any): number[] {
  const { x, y } = parsedCertificate.publicKeyDetails as PublicKeyDetailsECDSA;
  const pubKeyBytes = [...hexToBytes(x), ...hexToBytes(y)];
  return pubKeyBytes;
}

function hexToBytes(hex: string) {
  // Remove '0x' prefix if present
  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;

  const paddedHex = cleanHex.length % 2 ? '0' + cleanHex : cleanHex;

  const bytes = [];
  for (let i = 0; i < paddedHex.length; i += 2) {
    bytes.push(parseInt(paddedHex.slice(i, i + 2), 16));
  }
  return bytes;
}

export function extractRSFromSignature(signatureBytes: number[]): { r: string; s: string } {
  const derSignature = Buffer.from(signatureBytes).toString('binary');
  const asn1 = forge.asn1.fromDer(derSignature);
  const signatureAsn1 = asn1.value;

  assert(signatureAsn1.length === 2, 'Invalid signature format');
  assert(Array.isArray(asn1.value) && asn1.value.length === 2, 'Invalid signature format');

  const r = forge.util.createBuffer(asn1.value[0].value as string).toHex();
  const s = forge.util.createBuffer(asn1.value[1].value as string).toHex();

  return { r, s };
}

export function getNAndK(sigAlg: SignatureAlgorithm) {
  if (sigAlg.startsWith('ecdsa_')) {
    if (sigAlg.endsWith('224')) {
      return { n: 32, k: 7 };
    } else if (sigAlg.endsWith('256')) {
      return { n: n_dsc_ecdsa, k: 4 };
    } else if (sigAlg.endsWith('384')) {
      return { n: n_dsc_ecdsa, k: 6 };
    } else if (sigAlg.endsWith('512')) {
      return { n: n_dsc_ecdsa, k: 8 };
    } else if (sigAlg.endsWith('521')) {
      return { n: 66, k: 8 };
    } else {
      throw new Error('invalid key size');
    }
  }

  return { n: n_dsc, k: k_dsc }; // 2048/32 = 64
}

export function getNAndKCSCA(sigAlg: 'rsa' | 'ecdsa' | 'rsapss') {
  const n = sigAlg === 'ecdsa' ? n_dsc_ecdsa : n_csca;
  const k = sigAlg === 'ecdsa' ? k_dsc_ecdsa : k_csca;
  return { n, k };
}
