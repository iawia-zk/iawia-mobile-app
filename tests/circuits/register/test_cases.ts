// TODO: only use sha512 ecdsa
// Define the interface for test cases with optional saltLength
export interface TestCase {
  dgHashAlgo: string;
  eContentHashAlgo: string;
  sigAlg: string;
  hashFunction: string;
  domainParameter: string;
  keyLength: string;
  saltLength?: string; // Optional salt length for RSA-PSS
}


export const fullSigAlgs: TestCase[] = [
 
  // secp
  {
    dgHashAlgo: 'sha512',
    eContentHashAlgo: 'sha512',
    hashFunction: 'sha512',
    sigAlg: 'ecdsa',
    domainParameter: 'secp521r1',
    keyLength: '521',
  },
];
