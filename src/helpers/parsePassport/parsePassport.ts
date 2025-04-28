/* eslint-disable @typescript-eslint/no-unused-vars */
import { PassportData } from 'types/passportData';
import { parseCertificateSimple } from '../parseCertificate/parseCertificateSimple';
import { CertificateData, PublicKeyDetailsECDSA } from '../parseCertificate/certificate.types';
import { hashAlgos } from 'constants/circuits';
import {
  DscCertificateMetaData,
  parseDscCertificateData,
} from '../parseCertificate/parseDscCertificate';
import { brutforceSignatureAlgorithm } from './bruteForcePassportSignature';
import { findSubarrayIndex } from '../arrays/array';
import { formatMrz } from './format';
import { hash, getHashLen } from '../hash/hash';
import { PassportMetadata } from 'types/passportData';
import { Platform } from 'react-native';

function findHashSizeOfEContent(eContent: number[], signedAttr: number[]) {
  for (const hashFunction of hashAlgos) {
    const hashValue = hash(hashFunction, eContent);
    const hashOffset = findSubarrayIndex(signedAttr, hashValue as number[]);
    if (hashOffset !== -1) {
      return { hashFunction, offset: hashOffset };
    }
  }
  return { hashFunction: 'unknown', offset: -1 };
}

function findDG1HashInEContent(
  mrz: string,
  eContent: number[]
): { hash: number[]; hashFunction: string; offset: number } | null {
  const formattedMrz = formatMrz(mrz);

  for (const hashFunction of hashAlgos) {
    const hashValue = hash(hashFunction, formattedMrz);
    const normalizedHash = (hashValue as number[]).map((byte) => (byte > 127 ? byte - 256 : byte));
    const hashOffset = findSubarrayIndex(eContent, normalizedHash);

    if (hashOffset !== -1) {
      return { hash: hashValue as number[], hashFunction, offset: hashOffset };
    }
  }
  return null;
}
function getDgPaddingBytes(passportData: PassportData, dg1HashFunction: string): number {
  const formattedMrz = formatMrz(passportData.mrz);
  const hashValue = hash(dg1HashFunction, formattedMrz);
  const normalizedHash = (hashValue as number[]).map((byte) => (byte > 127 ? byte - 256 : byte));
  const dg1HashOffset = findSubarrayIndex(passportData.eContent, normalizedHash);
  const dg2Hash = passportData.dg2Hash;
  const normalizedDg2Hash = (dg2Hash as number[]).map((byte) => (byte > 127 ? byte - 256 : byte));
  const dg2HashOffset = findSubarrayIndex(passportData.eContent, normalizedDg2Hash);
  return dg2HashOffset - dg1HashOffset - getHashLen(dg1HashFunction);
}

export function getCountryCodeFromMrz(mrz: string): string {
  return mrz.substring(2, 5);
}

export function getCurveOrExponent(certData: CertificateData): string {
  return (certData.publicKeyDetails as PublicKeyDetailsECDSA).curve;
}

export function parsePassportData(passportData: PassportData): PassportMetadata {
  const dg1HashInfo = passportData.mrz
    ? findDG1HashInEContent(passportData.mrz, passportData.eContent)
    : null;

  const dg1HashFunction = dg1HashInfo?.hashFunction || 'unknown';
  const dg1HashOffset = dg1HashInfo?.offset || 0;
  let dgPaddingBytes = -1;
  try {
    dgPaddingBytes = getDgPaddingBytes(passportData, dg1HashFunction);
  } catch (error) {
    console.error('Error getting DG padding bytes:', error);
  }
  const { hashFunction: eContentHashFunction, offset: eContentHashOffset } = findHashSizeOfEContent(
    passportData.eContent,
    passportData.signedAttr
  );

  const brutForcedPublicKeyDetails = brutforceSignatureAlgorithm(passportData);

  let parsedDsc = null;
  let dscSignatureAlgorithmBits = 0;

  let dscMetaData: DscCertificateMetaData;

  if (passportData.dsc) {
    parsedDsc = parseCertificateSimple(passportData.dsc);
    dscSignatureAlgorithmBits = parseInt(parsedDsc.publicKeyDetails?.bits || '0', 10);

    dscMetaData = parseDscCertificateData(parsedDsc);
  }

  return {
    dataGroups:
      passportData.dgPresents
        ?.toString()
        .split(',')
        .map((item) => item.replace('DG', ''))
        .join(',') || 'None',
    dg1Size: passportData.mrz ? passportData.mrz.length : 0,
    dg1HashSize: passportData.dg1Hash ? passportData.dg1Hash.length : 0,
    dg1HashFunction,
    dg1HashOffset,
    dgPaddingBytes,
    eContentSize: passportData.eContent?.length || 0,
    eContentHashFunction,
    eContentHashOffset,
    signedAttrSize: passportData.signedAttr?.length || 0,
    signedAttrHashFunction: brutForcedPublicKeyDetails.hashAlgorithm,
    signatureAlgorithm: brutForcedPublicKeyDetails.signatureAlgorithm,
    saltLength: brutForcedPublicKeyDetails.saltLength,
    curveOrExponent: parsedDsc ? getCurveOrExponent(parsedDsc) : 'unknown',
    signatureAlgorithmBits: dscSignatureAlgorithmBits,
    countryCode: passportData.mrz ? getCountryCodeFromMrz(passportData.mrz) : 'unknown',
    cscaFound: dscMetaData.cscaFound,
    cscaHashFunction: dscMetaData.cscaHashAlgorithm,
    cscaSignatureAlgorithm: dscMetaData.cscaSignatureAlgorithm,
    cscaSaltLength: dscMetaData.cscaSaltLength,
    cscaCurveOrExponent: dscMetaData.cscaCurveOrExponent,
    cscaSignatureAlgorithmBits: dscMetaData.cscaSignatureAlgorithmBits,
    dsc: passportData.dsc,
    csca: dscMetaData?.csca || '',
  };
}

export function parseScanResponse(response: any) {
  return Platform.OS === 'android' ? handleResponseAndroid(response) : handleResponseIOS(response);
}

function handleResponseIOS(response: any): PassportData {
  const parsed = JSON.parse(response);
  const dgHashesObj = JSON.parse(parsed?.dataGroupHashes);
  const dg1HashString = dgHashesObj?.DG1?.sodHash;
  const dg1Hash = Array.from(Buffer.from(dg1HashString, 'hex'));
  const dg2HashString = dgHashesObj?.DG2?.sodHash;
  const dg2Hash = Array.from(Buffer.from(dg2HashString, 'hex'));

  const eContentBase64 = parsed?.eContentBase64;
  const signedAttributes = parsed?.signedAttributes;
  const mrz = parsed?.passportMRZ;
  const signatureBase64 = parsed?.signatureBase64;
  const _dataGroupsPresent = parsed?.dataGroupsPresent;
  const _placeOfBirth = parsed?.placeOfBirth;
  const _activeAuthenticationPassed = parsed?.activeAuthenticationPassed;
  const _isPACESupported = parsed?.isPACESupported;
  const _isChipAuthenticationSupported = parsed?.isChipAuthenticationSupported;
  const _residenceAddress = parsed?.residenceAddress;
  const passportPhoto = parsed?.passportPhoto;
  const _encapsulatedContentDigestAlgorithm = parsed?.encapsulatedContentDigestAlgorithm;
  const documentSigningCertificate = parsed?.documentSigningCertificate;
  const pem = JSON.parse(documentSigningCertificate).PEM.replace(/\n/g, '');
  const eContentArray = Array.from(Buffer.from(signedAttributes, 'base64'));
  const signedEContentArray = eContentArray.map((byte) => (byte > 127 ? byte - 256 : byte));

  const concatenatedDataHashesArray = Array.from(Buffer.from(eContentBase64, 'base64'));
  const concatenatedDataHashesArraySigned = concatenatedDataHashesArray.map((byte) =>
    byte > 127 ? byte - 256 : byte
  );

  const encryptedDigestArray = Array.from(Buffer.from(signatureBase64, 'base64')).map((byte) =>
    byte > 127 ? byte - 256 : byte
  );

  return {
    mrz,
    dsc: pem,
    dg2Hash: dg2Hash,
    dg1Hash: dg1Hash,
    dgPresents: parsed?.dataGroupsPresent,
    eContent: concatenatedDataHashesArraySigned,
    signedAttr: signedEContentArray,
    encryptedDigest: encryptedDigestArray,
    parsed: false,
    documentType: 'passport',
  } as PassportData;
}

function handleResponseAndroid(response: any): PassportData {
  const {
    mrz,
    eContent,
    encryptedDigest,
    _photo,
    _digestAlgorithm,
    _signerInfoDigestAlgorithm,
    _digestEncryptionAlgorithm,
    _LDSVersion,
    _unicodeVersion,
    encapContent,
    documentSigningCertificate,
    dataGroupHashes,
  } = response;

  const dgHashesObj = JSON.parse(dataGroupHashes);
  const dg1HashString = dgHashesObj['1'];
  const dg1Hash = Array.from(Buffer.from(dg1HashString, 'hex'));
  const dg2Hash = dgHashesObj['2'];
  const pem = documentSigningCertificate;

  const dgPresents = Object.keys(dgHashesObj)
    .map((key) => parseInt(key)) // eslint-disable-line radix
    .filter((num) => !isNaN(num))
    .sort((a, b) => a - b);

  return {
    mrz: mrz.replace(/\n/g, ''),
    dsc: pem,
    dg2Hash,
    dg1Hash,
    dgPresents,
    eContent: JSON.parse(encapContent),
    signedAttr: JSON.parse(eContent),
    encryptedDigest: JSON.parse(encryptedDigest),
    documentType: 'passport',
  } as PassportData;
}
