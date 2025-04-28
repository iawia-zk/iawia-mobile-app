import { assert } from 'helpers/assertions';
import { MrzResult } from './extractMrz.types';

export default function extractMRZInfo(mrzString: string): MrzResult {
  const mrzLines = mrzString.split('\n');
  assert(mrzLines.length >= 2, 'Invalid MRZ format: Expected two lines of MRZ data');

  let documentNumber = mrzLines[1].slice(0, 9).replace(/</g, '').trim();
  const birthDate = mrzLines[1].slice(13, 19).trim();
  const expiryDate = mrzLines[1].slice(21, 27).trim();

  return {
    documentNumber,
    birthDate,
    expiryDate,
  };
}
