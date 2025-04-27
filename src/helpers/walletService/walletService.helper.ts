import { ethers } from 'ethers';

export function getRawDataFromHex(hex: string) {
  return ethers.toUtf8String(hex);
}

export function formatBalance(balance: string): string {
  const num = parseFloat(balance);
  if (isNaN(num)) {
    return balance;
  }
  return num.toFixed(4);
}
