/* eslint-disable no-bitwise */
import { poseidon3, poseidon2, poseidon6, poseidon13, poseidon12 } from 'poseidon-lite';
import { ChildNodes, SMT } from '@openpassport/zk-kit-smt';
import { stringToAsciiBigIntArray } from '../circuits/uuid';
import { LeanIMT } from '@openpassport/zk-kit-lean-imt';
import { CertificateData } from '../parseCertificate/certificate.types';
import { packBytesAndPoseidon } from '../hash/hash';
import {
  DscCertificateMetaData,
  parseDscCertificateData,
} from '../parseCertificate/parseDscCertificate';
import { parseCertificateSimple } from '../parseCertificate/parseCertificateSimple';
import {
  CSCA_TREE_DEPTH,
  CSCA_TREE_URL_STAGING,
  CSCA_TREE_URL,
  DSC_TREE_DEPTH,
  DSC_TREE_URL,
  DSC_TREE_URL_STAGING,
  IDENTITY_TREE_URL,
  IDENTITY_TREE_URL_STAGING,
  max_csca_bytes,
  max_dsc_bytes,
} from 'constants/circuits';
import { IMT } from '@openpassport/zk-kit-imt';
import { pad } from '../parsePassport/passport';
import countries from 'i18n-iso-countries';
import en from 'i18n-iso-countries/langs/en.json';
import { EndpointType } from '../appType/appType';
import { DocumentType } from 'types/passportData';
import { assert } from 'helpers/assertions';

countries.registerLocale(en);

const OFAC_TREE_LEVELS = 0; // TODO: should this be higher or lower, 20?

export async function getCSCATree(endpointType: EndpointType): Promise<string[][]> {
  const cscaTreeUrl =
    endpointType === 'celo' || endpointType === 'https' ? CSCA_TREE_URL : CSCA_TREE_URL_STAGING;
  const response = await fetch(cscaTreeUrl);
  const data = await response.json();
  const status = data.status ? data.status : data;
  assert(status !== 'error', 'Error fetching CSCA tree');
  const tree = data.data ? JSON.parse(data.data) : data;

  console.log('CSCA tree:', tree);
  return tree;
}

export async function getDSCTree(endpointType: EndpointType): Promise<string> {
  const dscTreeUrl =
    endpointType === 'celo' || endpointType === 'https' ? DSC_TREE_URL : DSC_TREE_URL_STAGING;
  const response = await fetch(dscTreeUrl);
  const data = await response.json();
  const status = data.status ? data.status : data;
  assert(status !== 'error', 'Error fetching DSC tree');
  const tree = data.data ? data.data : data;
  console.log('DSC tree:', tree);
  return tree;
}

export async function getCommitmentTree(documentType: DocumentType | null): Promise<string> {
  const identityTreeUrl =
    !documentType || typeof documentType !== 'string' || documentType === 'passport'
      ? IDENTITY_TREE_URL
      : IDENTITY_TREE_URL_STAGING;
  const response = await fetch(identityTreeUrl);
  return await response.json().then((data) => (data.data ? data.data : data));
}

export async function fetchTreeFromUrl(url: string): Promise<LeanIMT> {
  const response = await fetch(url);
  assert(response.ok, 'Error fetching tree from URL');
  const commitmentMerkleTree = await response.json();
  console.log('\x1b[90m%s\x1b[0m', 'commitment merkle tree: ', commitmentMerkleTree);
  const tree = LeanIMT.import((a, b) => poseidon2([a, b]), commitmentMerkleTree);
  return tree;
}

/** get leaf for DSC and CSCA Trees */
export function getLeaf(parsed: CertificateData, type: 'dsc' | 'csca'): string {
  if (type === 'dsc') {
    // for now, we pad it for sha
    const tbsArray = Object.keys(parsed.tbsBytes).map((key) => parsed.tbsBytes[key]);
    const [paddedTbsBytes, tbsBytesPaddedLength] = pad()(tbsArray, max_dsc_bytes);
    const dsc_hash = packBytesAndPoseidon(Array.from(paddedTbsBytes));

    return poseidon2([dsc_hash, tbsArray.length]).toString();
  } else {
    const tbsBytesArray = Array.from(parsed.tbsBytes);
    const paddedTbsBytesArray = tbsBytesArray.concat(
      new Array(max_csca_bytes - tbsBytesArray.length).fill(0)
    );
    const csca_hash = packBytesAndPoseidon(paddedTbsBytesArray);
    return poseidon2([csca_hash, tbsBytesArray.length]).toString();
  }
}

export function getLeafDscTreeFromDscCertificateMetadata(
  dscParsed: CertificateData,
  dscMetaData: DscCertificateMetaData
): string {
  // TODO: WRONG  change this function using raw dsc and hashfunctions from passportMetadata
  const cscaParsed = parseCertificateSimple(dscMetaData.csca);
  return getLeafDscTree(dscParsed, cscaParsed);
}

export function getLeafDscTreeFromParsedDsc(dscParsed: CertificateData): string {
  return getLeafDscTreeFromDscCertificateMetadata(dscParsed, parseDscCertificateData(dscParsed));
}

export function getLeafDscTree(dsc_parsed: CertificateData, csca_parsed: CertificateData): string {
  const dscLeaf = getLeaf(dsc_parsed, 'dsc');
  const cscaLeaf = getLeaf(csca_parsed, 'csca');
  return poseidon2([dscLeaf, cscaLeaf]).toString();
}

export function getLeafCscaTree(csca_parsed: CertificateData): string {
  return getLeaf(csca_parsed, 'csca');
}

export function getDscTreeInclusionProof(
  leaf: string,
  serialized_dsc_tree: string
): [string, number[], bigint[], number] {
  const hashFunction = (a: any, b: any) => poseidon2([a, b]);
  const tree = LeanIMT.import(hashFunction, serialized_dsc_tree);
  const index = tree.indexOf(BigInt(leaf));
  assert(index !== -1, 'Your public key was not found in the registry');
  const { siblings, path, leaf_depth } = generateMerkleProof(tree, index, DSC_TREE_DEPTH);
  return [tree.root, path, siblings, leaf_depth];
}

export function getCscaTreeInclusionProof(leaf: string, _serialized_csca_tree: any[][]) {
  let tree = new IMT(poseidon2, CSCA_TREE_DEPTH, 0, 2);
  tree.setNodes(_serialized_csca_tree);
  const index = tree.indexOf(leaf);
  assert(index !== -1, 'Your public key was not found in the registry');
  const proof = tree.createProof(index);
  return [
    tree.root,
    proof.pathIndices.map((idx) => idx.toString()),
    proof.siblings.flat().map((sibling) => sibling.toString()),
  ];
}

export function getCscaTreeRoot(serialized_csca_tree: any[][]) {
  let tree = new IMT(poseidon2, CSCA_TREE_DEPTH, 0, 2);
  tree.setNodes(serialized_csca_tree);
  return tree.root;
}

export function formatRoot(root: string): string {
  let rootHex = BigInt(root).toString(16);
  return rootHex.length % 2 === 0 ? '0x' + rootHex : '0x0' + rootHex;
}

export function generateSMTProof(smt: SMT, leaf: bigint) {
  const { entry, matchingEntry, siblings, root, membership } = smt.createProof(leaf);
  const leaf_depth = siblings.length;

  let closestleaf;
  if (!matchingEntry) {
    // we got the 0 leaf or membership
    // then check if entry[1] exists
    if (!entry[1]) {
      // non membership proof
      closestleaf = BigInt(0); // 0 leaf
    } else {
      closestleaf = BigInt(entry[0]); // leaf itself (memb proof)
    }
  } else {
    // non membership proof
    closestleaf = BigInt(matchingEntry[0]); // actual closest
  }

  // PATH, SIBLINGS manipulation as per binary tree in the circuit
  siblings.reverse();
  while (siblings.length < OFAC_TREE_LEVELS) {
    siblings.push(BigInt(0));
  }

  // ----- Useful for debugging hence leaving as comments -----
  // const binary = entry[0].toString(2)
  // const bits = binary.slice(-leaf_depth);
  // let indices = bits.padEnd(256, "0").split("").map(Number)
  // const pathToMatch = num2Bits(256,BigInt(entry[0]))
  // while(indices.length < 256) indices.push(0);
  // // CALCULATED ROOT FOR TESTING
  // // closestleaf, leaf_depth, siblings, indices, root : needed
  // let calculatedNode = poseidon3([closestleaf,1,1]);
  // console.log("Initial node while calculating",calculatedNode)
  // console.log(smt.verifyProof(smt.createProof(leaf)))
  // for (let i= 0; i < leaf_depth ; i++) {
  //   const childNodes: any = indices[i] ? [siblings[i], calculatedNode] : [calculatedNode, siblings[i]]
  //   console.log(indices[i],childNodes)
  //   calculatedNode = poseidon2(childNodes)
  // }
  // console.log("Actual node", root)
  // console.log("calculated node", calculatedNode)
  // -----------------------------------------------------------

  return {
    root,
    leaf_depth,
    closestleaf,
    siblings,
  };
}

export function generateMerkleProof(imt: LeanIMT, _index: number, maxleaf_depth: number) {
  const { siblings: siblings, index } = imt.generateProof(_index);
  const leaf_depth = siblings.length;
  // The index must be converted to a list of indices, 1 for each tree level.
  // The circuit tree leaf_depth is 20, so the number of siblings must be 20, even if
  // the tree leaf_depth is actually 3. The missing siblings can be set to 0, as they
  // won't be used to calculate the root in the circuit.
  const path: number[] = [];

  for (let i = 0; i < maxleaf_depth; i += 1) {
    path.push((index >> i) & 1);
    if (siblings[i] === undefined) {
      siblings[i] = BigInt(0);
    }
  }
  return { siblings, path, leaf_depth };
}

// SMT trees for 3 levels of matching :
// 1. Passport Number and Nationality tree : level 3 (Absolute Match)
// 2. Name and date of birth combo tree : level 2 (High Probability Match)
// 3. Name and year of birth combo tree : level 1 (Partial Match)
export function buildSMT(field: any[], treetype: string): [number, number, SMT] {
  let count = 0;
  let startTime = performance.now();

  const hash2 = (childNodes: ChildNodes) =>
    childNodes.length === 2 ? poseidon2(childNodes) : poseidon3(childNodes);
  const tree = new SMT(hash2, true);

  for (let i = 0; i < field.length; i++) {
    const entry = field[i];

    if (i !== 0) {
      console.log('Processing', treetype, 'number', i, 'out of', field.length);
    }

    let leaf = BigInt(0);
    if (treetype === 'passport_no_and_nationality') {
      leaf = processPassportNoAndNationality(entry.Pass_No, entry.Pass_Country, i);
    } else if (treetype === 'name_and_dob') {
      leaf = processNameAndDob(entry, i);
    } else if (treetype === 'name_and_yob') {
      leaf = processNameAndYob(entry, i);
    } else if (treetype === 'country') {
      const keys = Object.keys(entry);
      leaf = processCountry(keys[0], entry[keys[0]], i);
    }

    if (leaf == BigInt(0) || tree.createProof(leaf).membership) {
      console.log('This entry already exists in the tree, skipping...');
      continue;
    }

    count += 1;
    tree.add(leaf, BigInt(1));
  }

  console.log('Total', treetype, 'paresed are : ', count, ' over ', field.length);
  console.log(treetype, 'tree built in', performance.now() - startTime, 'ms');
  return [count, performance.now() - startTime, tree];
}

function processPassportNoAndNationality(
  passno: string,
  nationality: string,
  index: number
): bigint {
  if (passno.length > 9) {
    console.log('passport number length is greater than 9:', index, passno);
  } else if (passno.length < 9) {
    while (passno.length !== 9) {
      passno += '<';
    }
  }

  const countryCode = getCountryCode(nationality);
  if (!countryCode) {
    console.log('Error getting country code', index, nationality);
    return BigInt(0);
  }
  console.log('nationality and countryCode', nationality, countryCode);

  const leaf = getPassportNumberAndNationalityLeaf(
    stringToAsciiBigIntArray(passno),
    stringToAsciiBigIntArray(countryCode),
    index
  );
  if (!leaf) {
    console.log('Error creating leaf value', index, passno, nationality);
    return BigInt(0);
  }
  return leaf;
}

// this is a temporary workaround for some of the country name,
// will be removed once we parse the OFAC list better, starting from the XML file.
const normalizeCountryName = (country: string): string => {
  const mapping: Record<string, string> = {
    palestinian: 'Palestine',
    'korea, north': 'North Korea',
    'korea, south': 'Korea, Republic of',
    'united kingdom': 'United Kingdom',
    syria: 'Syrian Arab Republic',
    burma: 'Myanmar',
    'cabo verde': 'Cape Verde',
    'congo, democratic republic of the': 'Democratic Republic of the Congo',
    macau: 'Macao',
  };
  return mapping[country.toLowerCase()] || country;
};

const getCountryCode = (countryName: string): string | undefined => {
  return countries.getAlpha3Code(normalizeCountryName(countryName), 'en');
};

function generateSmallKey(input: bigint): bigint {
  return input % (BigInt(1) << BigInt(OFAC_TREE_LEVELS));
}

function processNameAndDob(entry: any, i: number): bigint {
  const firstName = entry.First_Name;
  const lastName = entry.Last_Name;
  const day = entry.day;
  const month = entry.month;
  const year = entry.year;
  if (day == null || month == null || year == null) {
    console.log('dob is null', i, entry);
    return BigInt(0);
  }
  const nameHash = processName(firstName, lastName, i);
  const dobHash = processDob(day, month, year, i);
  return generateSmallKey(poseidon2([dobHash, nameHash]));
}

function processNameAndYob(entry: any, i: number): bigint {
  const firstName = entry.First_Name;
  const lastName = entry.Last_Name;
  const year = entry.year;
  if (year == null) {
    console.log('year is null', i, entry);
    return BigInt(0);
  }
  const nameHash = processName(firstName, lastName, i);
  const yearHash = processYear(year, i);
  return generateSmallKey(poseidon2([yearHash, nameHash]));
}

function processYear(year: string, i: number): bigint {
  year = year.slice(-2);
  const yearArr = stringToAsciiBigIntArray(year);
  return getYearLeaf(yearArr);
}

function getYearLeaf(yearArr: (bigint | number)[]): bigint {
  return poseidon2(yearArr);
}

function processName(firstName: string, lastName: string, i: number): bigint {
  // LASTNAME<<FIRSTNAME<MIDDLENAME<<<... (6-44)
  firstName = firstName.replace(/'/g, '');
  firstName = firstName.replace(/\./g, '');
  firstName = firstName.replace(/[- ]/g, '<');
  lastName = lastName.replace(/'/g, '');
  lastName = lastName.replace(/[- ]/g, '<');
  lastName = lastName.replace(/\./g, '');
  // Removed apostrophes from the first name, eg O'Neil -> ONeil
  // Replace spaces and hyphens with '<' in the first name, eg John Doe -> John<Doe
  // TODO : Handle special cases like malaysia : no two filler characters like << for surname and givenname
  // TODO : Verify rules for . in names. eg : J. Doe (Done same as apostrophe for now)

  let arr = lastName + '<<' + firstName;
  if (arr.length > 39) {
    arr = arr.substring(0, 39);
  } else {
    while (arr.length < 39) {
      arr += '<';
    }
  }
  let nameArr = stringToAsciiBigIntArray(arr);
  return getNameLeaf(nameArr, i);
}

function processDob(day: string, month: string, year: string, i: number): bigint {
  // YYMMDD
  const monthMap: { [key: string]: string } = {
    jan: '01',
    feb: '02',
    mar: '03',
    apr: '04',
    may: '05',
    jun: '06',
    jul: '07',
    aug: '08',
    sep: '09',
    oct: '10',
    nov: '11',
    dec: '12',
  };

  month = monthMap[month.toLowerCase()];
  year = year.slice(-2);
  const dob = year + month + day;
  let arr = stringToAsciiBigIntArray(dob);
  return getDobLeaf(arr, i);
}

function processCountry(country1: string, country2: string, i: number) {
  let arr = stringToAsciiBigIntArray(country1);
  let arr2 = stringToAsciiBigIntArray(country2);

  const leaf = getCountryLeaf(arr, arr2, i);
  if (!leaf) {
    console.log('Error creating leaf value', i, country1, country2);
    return BigInt(0);
  }
  return leaf;
}

export function getCountryLeaf(
  country_by: (bigint | number)[],
  country_to: (bigint | number)[],
  i?: number
): bigint {
  if (country_by.length !== 3 || country_to.length !== 3) {
    console.log('parsed passport length is not 3:', i, country_to, country_by);
    return BigInt(0);
  }
  try {
    const country = country_by.concat(country_to);
    return poseidon6(country);
  } catch (err) {
    console.log('err : sanc_country hash', err, i, country_by, country_to);
  }
}

export function getPassportNumberAndNationalityLeaf(
  passport: (bigint | number)[],
  nationality: (bigint | number)[],
  i?: number
): bigint {
  if (passport.length !== 9) {
    console.log('parsed passport length is not 9:', i, passport);
    return BigInt(0);
  }
  if (nationality.length !== 3) {
    console.log('parsed nationality length is not 3:', i, nationality);
    return BigInt(0);
  }
  try {
    const fullHash = poseidon12(passport.concat(nationality));
    return generateSmallKey(fullHash);
  } catch (err) {
    console.log('err : passport', err, i, passport);
  }
}

export function getNameDobLeaf(
  nameMrz: (bigint | number)[],
  dobMrz: (bigint | number)[],
  i?: number
): bigint {
  return generateSmallKey(poseidon2([getDobLeaf(dobMrz), getNameLeaf(nameMrz)]));
}

export function getNameYobLeaf(
  nameMrz: (bigint | number)[],
  yobMrz: (bigint | number)[],
  i?: number
): bigint {
  return generateSmallKey(poseidon2([getYearLeaf(yobMrz), getNameLeaf(nameMrz)]));
}

export function getNameLeaf(nameMrz: (bigint | number)[], i?: number): bigint {
  let middleChunks: bigint[] = [];
  let chunks: (number | bigint)[][] = [];

  chunks.push(nameMrz.slice(0, 13), nameMrz.slice(13, 26), nameMrz.slice(26, 39)); // 39/3 for posedion to digest

  for (const chunk of chunks) {
    middleChunks.push(poseidon13(chunk));
  }

  try {
    return poseidon3(middleChunks);
  } catch (err) {
    console.log('err : Name', err, i, nameMrz);
  }
}

export function getDobLeaf(dobMrz: (bigint | number)[], i?: number): bigint {
  if (dobMrz.length !== 6) {
    console.log('parsed dob length is not 9:', i, dobMrz);
    return BigInt(0);
  }
  try {
    return poseidon6(dobMrz);
  } catch (err) {
    console.log('err : Dob', err, i, dobMrz);
  }
}
