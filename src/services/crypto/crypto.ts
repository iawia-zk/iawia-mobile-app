import { keccak256 } from 'ethers';

export function hashPassport(passportId: string): string {
  return keccak256(Buffer.from(passportId + process.env.PASSPORT_SALT));
}
