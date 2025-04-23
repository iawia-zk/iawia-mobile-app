import { PassportData } from '../parsePassport/passportData.types';

export function getCircuitNameFromPassportData(
  passportData: PassportData,
  circuitType: 'register' | 'dsc'
) {
  if (circuitType === 'register') {
    return getRegisterNameFromPassportData(passportData);
  } else {
    return getDSCircuitNameFromPassportData(passportData);
  }
}

function getDSCircuitNameFromPassportData(passportData: PassportData) {
  console.log('Getting DSC circuit name from passport data...');

  if (!passportData.passportMetadata) {
    console.error('Passport metadata is missing');
    throw new Error('Passport data are not parsed');
  }
  const passportMetadata = passportData.passportMetadata;

  if (!passportMetadata.cscaFound) {
    console.error('CSCA not found in passport metadata');
    throw new Error('CSCA not found');
  }

  const signatureAlgorithm = passportMetadata.cscaSignatureAlgorithm;
  const hashFunction = passportMetadata.cscaHashFunction;

  console.log('CSCA Signature Algorithm:', signatureAlgorithm);
  console.log('CSCA Hash Function:', hashFunction);

  if (signatureAlgorithm === 'ecdsa') {
    console.log('Processing ECDSA signature...');
    const curve = passportMetadata.cscaCurveOrExponent;
    console.log('ECDSA curve:', curve);
    const circuitName = `dsc_${hashFunction}_${signatureAlgorithm}_${curve}`;
    console.log('Generated circuit name:', circuitName);
    return circuitName;
  } else {
    console.error('Unsupported signature algorithm:', signatureAlgorithm);
    throw new Error('Unsupported signature algorithm');
  }
}

function getRegisterNameFromPassportData(passportData: PassportData) {
  console.log('Getting register circuit name from passport data...');

  if (!passportData.passportMetadata) {
    console.error('Passport metadata is missing');
    throw new Error('Passport data are not parsed');
  }
  const passportMetadata = passportData.passportMetadata;

  if (!passportMetadata.cscaFound) {
    console.error('CSCA not found in passport metadata');
    throw new Error('CSCA not found');
  }

  const parsedDsc = passportData.dsc_parsed;

  const dgHashAlgo = passportMetadata.dg1HashFunction;
  const eContentHashAlgo = passportMetadata.eContentHashFunction;
  const signedAttrHashAlgo = passportMetadata.signedAttrHashFunction;
  const sigAlg = passportMetadata.signatureAlgorithm;

  console.log('DG Hash Algorithm:', dgHashAlgo);
  console.log('eContent Hash Algorithm:', eContentHashAlgo);
  console.log('Signed Attributes Hash Algorithm:', signedAttrHashAlgo);
  console.log('Signature Algorithm:', sigAlg);

  if (parsedDsc.signatureAlgorithm === 'ecdsa') {
    console.log('Processing ECDSA signature...');
    const { curveOrExponent } = passportMetadata;
    console.log('ECDSA curve:', curveOrExponent);
    const circuitName = `register_${dgHashAlgo}_${eContentHashAlgo}_${signedAttrHashAlgo}_${sigAlg}_${curveOrExponent}`;
    console.log('Generated circuit name:', circuitName);
    return circuitName;
  } else {
    console.error('Unsupported signature algorithm:', parsedDsc.signatureAlgorithm);
    throw new Error('Unsupported signature algorithm');
  }
}
