import { MrzResult } from './extractMrz.types';

export default function extractMRZInfo(mrzString: string): MrzResult {
  const mrzLines = mrzString.split('\n');

  if (mrzLines.length < 2) {
    throw new Error('Invalid MRZ format: Expected two lines of MRZ data');
  }

  let passportNumber = mrzLines[1].slice(0, 9).replace(/</g, '').trim();
  const dateOfBirth = mrzLines[1].slice(13, 19).trim();
  const dateOfExpiry = mrzLines[1].slice(21, 27).trim();

  return {
    passportNumber,
    dateOfBirth,
    dateOfExpiry,
  };
}
