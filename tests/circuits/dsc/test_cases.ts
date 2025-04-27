// TODO: only use sha512 ecdsa

export const fullSigAlgs = [
  //ECDSA
  { sigAlg: 'ecdsa', hashFunction: 'sha512', domainParameter: 'secp521r1', keyLength: '521' },
  // this last one does not pass right now but only because of the issue
  // of the function that selects the position of the pubkey in ecdsa certs
  // sometimes being off by one
];
