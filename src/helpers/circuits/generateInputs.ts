import {
  MAX_PADDED_ECONTENT_LEN,
  MAX_PADDED_SIGNED_ATTR_LEN,
  max_dsc_bytes,
  max_csca_bytes,
  COMMITMENT_TREE_DEPTH,
} from 'constants/circuits';
import { PassportData } from 'types/passportData';
import { LeanIMT } from '@openpassport/zk-kit-lean-imt';
import {
  getCountryLeaf,
  getLeafCscaTree,
  getLeafDscTree,
  getCscaTreeInclusionProof,
  getDscTreeInclusionProof,
} from '../trees/trees';
import { SMT } from '@openpassport/zk-kit-smt';
import {
  extractSignatureFromDSC,
  findStartPubKeyIndex,
  formatSignatureDSCCircuit,
  generateCommitment,
  getCertificatePubKey,
  getPassportSignatureInfos,
  pad,
  padWithZeroes,
} from '../parsePassport/passport';
import { hash, packBytesAndPoseidon } from '../hash/hash';
import { formatMrz } from '../parsePassport/format';
import { castFromUUID, stringToAsciiBigIntArray } from '../circuits/uuid';
import { getCurrentDateYYMMDD } from '../date';
import { formatCountriesList } from '../parsePassport/format';
import { generateMerkleProof, generateSMTProof } from '../trees/trees';
import { parseCertificateSimple } from '../parseCertificate/parseCertificateSimple';
import { parseDscCertificateData } from '../parseCertificate/parseDscCertificate';

export function generateCircuitInputsDSC(dscCertificate: string, serializedCscaTree: string[][]) {
  const dscParsed = parseCertificateSimple(dscCertificate);
  const dscMetadata = parseDscCertificateData(dscParsed);
  const cscaParsed = parseCertificateSimple(dscMetadata.csca);

  // CSCA is padded with 0s to max_csca_bytes
  const cscaTbsBytesPadded = padWithZeroes(cscaParsed.tbsBytes, max_csca_bytes);
  const dscTbsBytes = dscParsed.tbsBytes;

  // DSC is padded using sha padding because it will be hashed in the circuit
  const [dscTbsBytesPadded, dscTbsBytesLen] = pad()(dscTbsBytes, max_dsc_bytes);

  const leaf = getLeafCscaTree(cscaParsed);
  const [root, path, siblings] = getCscaTreeInclusionProof(leaf, serializedCscaTree);

  // Parse CSCA certificate and get its public key
  const csca_pubKey_formatted = getCertificatePubKey(
    cscaParsed,
    dscMetadata.cscaSignatureAlgorithm
  );

  const signatureRaw = extractSignatureFromDSC(dscCertificate);
  const signature = formatSignatureDSCCircuit(
    dscMetadata.cscaSignatureAlgorithm,
    dscMetadata.cscaHashAlgorithm,
    cscaParsed,
    signatureRaw
  );

  // Get start index of CSCA pubkey based on algorithm
  const [startIndex, keyLength] = findStartPubKeyIndex(
    cscaParsed,
    cscaTbsBytesPadded,
    dscMetadata.cscaSignatureAlgorithm
  );

  return {
    raw_csca: cscaTbsBytesPadded.map((x) => x.toString()),
    raw_csca_actual_length: BigInt(cscaParsed.tbsBytes.length).toString(),
    csca_pubKey_offset: startIndex.toString(),
    csca_pubKey_actual_size: BigInt(keyLength).toString(),
    raw_dsc: Array.from(dscTbsBytesPadded).map((x) => x.toString()),
    raw_dsc_padded_length: BigInt(dscTbsBytesLen).toString(), // with the sha padding actually
    csca_pubKey: csca_pubKey_formatted,
    signature,
    merkle_root: root,
    path: path,
    siblings: siblings,
  };
}

export function generateCircuitInputsRegister(
  secret: string,
  passportData: PassportData,
  serializedDscTree: string
) {
  const { mrz, eContent, signedAttr } = passportData;
  const passportMetadata = passportData.passportMetadata;
  const dscParsed = passportData.dsc_parsed;

  const [dscTbsBytesPadded] = pad()(dscParsed.tbsBytes, max_dsc_bytes);

  const { pubKey, signature, signatureAlgorithmFullName } = getPassportSignatureInfos(passportData);
  const mrz_formatted = formatMrz(mrz);

  if (eContent.length > MAX_PADDED_ECONTENT_LEN[signatureAlgorithmFullName]) {
    console.error(
      `eContent too long (${eContent.length} bytes). Max length is ${MAX_PADDED_ECONTENT_LEN[signatureAlgorithmFullName]} bytes.`
    );
    throw new Error(
      `This length of datagroups (${eContent.length} bytes) is currently unsupported. Please contact us so we add support!`
    );
  }

  const [eContentPadded, eContentLen] = pad(passportMetadata.eContentHashFunction)(
    eContent,
    MAX_PADDED_ECONTENT_LEN[passportMetadata.dg1HashFunction]
  );
  const [signedAttrPadded, signedAttrPaddedLen] = pad()(
    signedAttr,
    MAX_PADDED_SIGNED_ATTR_LEN[passportMetadata.eContentHashFunction]
  );

  const dsc_leaf = getLeafDscTree(dscParsed, passportData.csca_parsed); // TODO: WRONG
  const [root, path, siblings, leaf_depth] = getDscTreeInclusionProof(dsc_leaf, serializedDscTree);
  const csca_tree_leaf = getLeafCscaTree(passportData.csca_parsed);

  // Get start index of DSC pubkey based on algorithm
  const [startIndex, keyLength] = findStartPubKeyIndex(
    dscParsed,
    dscTbsBytesPadded,
    dscParsed.signatureAlgorithm
  );

  const inputs = {
    raw_dsc: dscTbsBytesPadded.map((x) => x.toString()),
    raw_dsc_actual_length: [BigInt(dscParsed.tbsBytes.length).toString()],
    dsc_pubKey_offset: startIndex,
    dsc_pubKey_actual_size: [BigInt(keyLength).toString()],
    dg1: mrz_formatted,
    dg1_hash_offset: passportMetadata.dg1HashOffset,
    eContent: eContentPadded,
    eContent_padded_length: eContentLen,
    signed_attr: signedAttrPadded,
    signed_attr_padded_length: signedAttrPaddedLen,
    signed_attr_econtent_hash_offset: passportMetadata.eContentHashOffset,
    pubKey_dsc: pubKey,
    signature_passport: signature,
    merkle_root: [BigInt(root).toString()],
    leaf_depth: leaf_depth,
    path: path,
    siblings: siblings,
    csca_tree_leaf: csca_tree_leaf,
    secret: secret,
  };

  return Object.entries(inputs)
    .map(([key, value]) => ({
      [key]: formatInput(value),
    }))
    .reduce((acc, curr) => ({ ...acc, ...curr }), {});
}

export function generateCircuitInputsVCandDisclose(
  secret: string,
  attestation_id: string,
  passportData: PassportData,
  scope: string,
  selector_dg1: string[],
  selector_older_than: string | number,
  majority: string,
  forbidden_countries_list: string[],
  user_identifier: string
) {
  const formattedMrz = formatMrz(passportData.mrz);
  const passportMetadata = passportData.passportMetadata;
  const eContent_shaBytes = hash(
    passportMetadata.eContentHashFunction,
    Array.from(passportData.eContent),
    'bytes'
  );
  const eContent_packed_hash = packBytesAndPoseidon(
    (eContent_shaBytes as number[]).map((byte) => byte & 0xff)
  );

  const dsc_tree_leaf = getLeafDscTree(passportData.dsc_parsed, passportData.csca_parsed);

  const formattedMajority = majority.length === 1 ? `0${majority}` : majority;
  const majority_ascii = formattedMajority.split('').map((char) => char.charCodeAt(0));

  return {
    secret: formatInput(secret),
    attestation_id: formatInput(attestation_id),
    dg1: formatInput(formattedMrz),
    eContent_shaBytes_packed_hash: formatInput(eContent_packed_hash),
    selector_dg1: formatInput(selector_dg1),
    selector_older_than: formatInput(selector_older_than),
    scope: formatInput(scope),
    current_date: formatInput(getCurrentDateYYMMDD()),
    majority: formatInput(majority_ascii),
    user_identifier: formatInput(castFromUUID(user_identifier)),
    forbidden_countries_list: formatInput(formatCountriesList(forbidden_countries_list)),
  };
}

export function generateCircuitInputsCountryVerifier(
  passportData: PassportData,
  sparsemerkletree: SMT
) {
  const mrz_bytes = formatMrz(passportData.mrz);
  const usa_ascii = stringToAsciiBigIntArray('USA');
  const country_leaf = getCountryLeaf(usa_ascii, mrz_bytes.slice(7, 10));
  const { root, closestleaf, siblings } = generateSMTProof(sparsemerkletree, country_leaf);

  return {
    dg1: formatInput(mrz_bytes),
    hostCountry: formatInput(usa_ascii),
    smt_leaf_key: formatInput(closestleaf),
    smt_root: formatInput(root),
    smt_siblings: formatInput(siblings),
  };
}

// this get the commitment index whether it is a string or a bigint
// this is necessary rn because when the tree is send from the server in a serialized form,
// the bigints are converted to strings and I can't figure out how to use tree.import to load bigints there
export function findIndexInTree(tree: LeanIMT, commitment: bigint): number {
  let index = tree.indexOf(commitment);
  if (index === -1) {
    index = tree.indexOf(commitment.toString() as unknown as bigint);
  }
  if (index === -1) {
    throw new Error('This commitment was not found in the tree');
  } else {
    //  console.log(`Index of commitment in the registry: ${index}`);
  }
  return index;
}

export function formatInput(input: any) {
  if (Array.isArray(input)) {
    return input.map((item) => BigInt(item).toString());
  } else if (input instanceof Uint8Array) {
    return Array.from(input).map((num) => BigInt(num).toString());
  } else if (typeof input === 'string' && input.includes(',')) {
    const numbers = input
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s !== '' && !isNaN(Number(s)))
      .map(Number);

    try {
      return numbers.map((num) => BigInt(num).toString());
    } catch (e) {
      throw e;
    }
  } else {
    return [BigInt(input).toString()];
  }
}
