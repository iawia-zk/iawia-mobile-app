import { toUnsignedByte } from './bytes';

export function formatAndConcatenateDataHashes(
  dataHashes: [number, number[]][],
  dg1HashOffset: number
) {
  // concatenating dataHashes :
  let concat: number[] = [];

  const startingSequence = Array.from(
    { length: dg1HashOffset },
    () => Math.floor(Math.random() * 256) - 128
  );

  concat.push(...startingSequence);

  for (const dataHash of dataHashes) {
    // console.log(`dataHash ${dataHash[0]}`, dataHash[1].map(byte => (byte < 0 ? byte + 256 : byte).toString(16).padStart(2, '0')).join(''));

    //push 7 padding bytes
    concat.push(...[0, 0, 0, 0, 0, 0, 0]);

    concat.push(...dataHash[1]);
    // concat.push(...[48, hashLen + 5, 2, 1, dataHash[0], 4, hashLen, ...dataHash[1]])
    // 48, 37, 2, 1, 1, 4, 32,
    // 48, 53, 2, 1, 1, 4, 48,
  }

  return concat;
}

export function generateSignedAttr(messageDigest: number[]) {
  const constructedEContent = [];

  // Detailed description is in private file r&d.ts for now
  // First, the tag and length, assumed to be always the same
  constructedEContent.push(...[49, 102]);

  // 1.2.840.113549.1.9.3 is RFC_3369_CONTENT_TYPE_OID
  constructedEContent.push(...[48, 21, 6, 9, 42, -122, 72, -122, -9, 13, 1, 9, 3]);
  // 2.23.136.1.1.1 is ldsSecurityObject
  constructedEContent.push(...[49, 8, 6, 6, 103, -127, 8, 1, 1, 1]);

  // 1.2.840.113549.1.9.5 is signing-time
  constructedEContent.push(...[48, 28, 6, 9, 42, -122, 72, -122, -9, 13, 1, 9, 5]);
  // mock time of signature
  constructedEContent.push(...[49, 15, 23, 13, 49, 57, 49, 50, 49, 54, 49, 55, 50, 50, 51, 56, 90]);
  // 1.2.840.113549.1.9.4 is RFC_3369_MESSAGE_DIGEST_OID
  constructedEContent.push(...[48, 47, 6, 9, 42, -122, 72, -122, -9, 13, 1, 9, 4]);
  // TAG and length of the message digest
  constructedEContent.push(...[49, 34, 4, 32]);

  constructedEContent.push(...messageDigest);
  return constructedEContent;
}
export function formatMrz(mrz: string) {
  const mrzCharcodes = [...mrz].map((char) => char.charCodeAt(0));

  mrzCharcodes.unshift(88); // the length of the mrz data
  mrzCharcodes.unshift(95, 31); // the MRZ_INFO_TAG
  mrzCharcodes.unshift(91); // the new length of the whole array
  mrzCharcodes.unshift(97); // the tag for DG1

  return mrzCharcodes;
}
export function formatDg2Hash(dg2Hash: number[]) {
  const unsignedBytesDg2Hash = dg2Hash.map((x) => toUnsignedByte(x));
  while (unsignedBytesDg2Hash.length < 64) {
    // pad it to 64 bytes to correspond to the hash length of sha512 and avoid multiplying circuits
    unsignedBytesDg2Hash.push(0);
  }
  return unsignedBytesDg2Hash;
}
