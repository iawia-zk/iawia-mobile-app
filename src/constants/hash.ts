export const TREE_TRACKER_URL = 'https://tree.self.xyz';
export const CSCA_TREE_DEPTH = 12;
export const DSC_TREE_DEPTH = 21;
export const COMMITMENT_TREE_DEPTH = 33;
export const DEFAULT_USER_ID_TYPE = 'uuid';

export const REDIRECT_URL = 'https://redirect.self.xyz';
export const WS_RPC_URL_VC_AND_DISCLOSE = 'ws://disclose.proving.self.xyz:8888/';
export const WS_DB_RELAYER = 'wss://websocket.self.xyz';
export const WS_DB_RELAYER_STAGING = 'wss://websocket.staging.self.xyz';
export const API_URL = 'https://api.self.xyz';
export const API_URL_STAGING = 'https://api.staging.self.xyz';
export const CSCA_TREE_URL = 'https://tree.self.xyz/csca';
export const DSC_TREE_URL = 'https://tree.self.xyz/dsc';
export const CSCA_TREE_URL_STAGING = 'https://tree.staging.self.xyz/csca';
export const DSC_TREE_URL_STAGING = 'https://tree.staging.self.xyz/dsc';
export const IDENTITY_TREE_URL = 'https://tree.self.xyz/identity';
export const IDENTITY_TREE_URL_STAGING = 'https://tree.staging.self.xyz/identity';

export const PASSPORT_ATTESTATION_ID = '1'; //"8518753152044246090169372947057357973469996808638122125210848696986717482788"

export const CHAIN_NAME = 'celo';
export const RPC_URL = 'https://forno.celo.org';
export const PCR0_MANAGER_ADDRESS = '0xE36d4EE5Fd3916e703A46C21Bb3837dB7680C8B8';

// we make it global here because passing it to generateCircuitInputsRegister caused trouble
export const DEVELOPMENT_MODE = true;
export const DEFAULT_MAJORITY = '18';

export const hashAlgos = ['sha512', 'sha384', 'sha256', 'sha224', 'sha1'];
export const saltLengths = [64, 48, 32];

export const MAX_FORBIDDEN_COUNTRIES_LIST_LENGTH = 40;

export const DEPLOYED_CIRCUITS_REGISTER = [
  'register_sha1_sha1_sha1_rsa_65537_4096',
  'register_sha1_sha256_sha256_rsa_65537_4096',
  'register_sha224_sha224_sha224_ecdsa_brainpoolP224r1',
  'register_sha256_sha224_sha224_ecdsa_secp224r1',
  'register_sha256_sha256_sha256_ecdsa_brainpoolP256r1',
  'register_sha256_sha256_sha256_ecdsa_brainpoolP384r1',
  'register_sha256_sha256_sha256_ecdsa_secp256r1',
  'register_sha256_sha256_sha256_ecdsa_secp384r1',
  'register_sha256_sha256_sha256_rsa_3_4096',
  'register_sha256_sha256_sha256_rsa_65537_4096',
  'register_sha256_sha256_sha256_rsapss_3_32_2048',
  'register_sha256_sha256_sha256_rsapss_65537_32_2048',
  'register_sha256_sha256_sha256_rsapss_65537_32_3072',
  'register_sha384_sha384_sha384_ecdsa_brainpoolP384r1',
  'register_sha384_sha384_sha384_ecdsa_brainpoolP512r1',
  'register_sha384_sha384_sha384_ecdsa_secp384r1',
  'register_sha384_sha384_sha384_rsapss_65537_48_2048',
  'register_sha1_sha1_sha1_ecdsa_brainpoolP224r1',
  'register_sha512_sha512_sha512_ecdsa_brainpoolP512r1',
  'register_sha512_sha512_sha512_rsa_65537_4096',
  'register_sha512_sha512_sha512_rsapss_65537_64_2048',
];

export const OFAC_TREE_LEVELS = 64;

export const DEPLOYED_CIRCUITS_DSC = [
  'dsc_sha1_ecdsa_brainpoolP256r1',
  'dsc_sha1_rsa_65537_4096',
  'dsc_sha256_ecdsa_brainpoolP256r1',
  'dsc_sha256_ecdsa_brainpoolP384r1',
  'dsc_sha256_ecdsa_secp256r1',
  'dsc_sha256_ecdsa_secp384r1',
  'dsc_sha256_rsa_65537_4096',
  'dsc_sha256_rsapss_3_32_3072',
  'dsc_sha256_rsapss_65537_32_3072',
  'dsc_sha256_rsapss_65537_32_4096',
  'dsc_sha384_ecdsa_brainpoolP384r1',
  'dsc_sha384_ecdsa_brainpoolP512r1',
  'dsc_sha384_ecdsa_secp384r1',
  'dsc_sha512_ecdsa_brainpoolP512r1',
  'dsc_sha512_rsa_65537_4096',
  'dsc_sha512_rsapss_65537_64_4096',
];

export const MAX_PADDED_ECONTENT_LEN: Partial<Record<(typeof hashAlgos)[number], number>> = {
  sha1: 384,
  sha224: 512,
  sha256: 512,
  sha384: 768,
  sha512: 896,
};

export const MAX_PADDED_SIGNED_ATTR_LEN: Record<(typeof hashAlgos)[number], number> = {
  sha1: 128,
  sha224: 128,
  sha256: 128,
  sha384: 256,
  sha512: 256,
};

export const MAX_CERT_BYTES: Partial<Record<keyof typeof SignatureAlgorithmIndex, number>> = {
  rsa_sha256_65537_4096: 512,
  rsa_sha1_65537_4096: 640,
  rsapss_sha256_65537_2048: 640,
  rsapss_sha256_65537_3072: 640,
  rsapss_sha256_65537_4096: 768,
  rsapss_sha256_3_3072: 768,
  rsapss_sha256_3_4096: 768,
  rsapss_sha384_65537_3072: 768,
};

export const ECDSA_K_LENGTH_FACTOR = 2;
// possible values because of sha1 constraints: 192,320,384, 448, 576, 640

export const CIRCUIT_TYPES = ['dsc', 'register', 'vc_and_disclose'];
export const circuitNameFromMode = {
  prove: 'prove',
  prove_onchain: 'prove',
  prove_offchain: 'prove',
  register: 'prove',
  vc_and_disclose: 'vc_and_disclose',
  dsc: 'dsc',
};

export enum RegisterVerifierId {
  register_sha256_sha256_sha256_rsa_65537_4096 = 0,
  register_sha256_sha256_sha256_ecdsa_brainpoolP384r1 = 1,
  register_sha256_sha256_sha256_ecdsa_secp256r1 = 2,
  register_sha256_sha256_sha256_ecdsa_secp384r1 = 3,
  register_sha256_sha256_sha256_rsa_3_4096 = 4,
  register_sha256_sha256_sha256_rsapss_3_32_2048 = 5,
  register_sha256_sha256_sha256_rsapss_65537_32_2048 = 6,
  register_sha256_sha256_sha256_rsapss_65537_32_3072 = 7,
  register_sha384_sha384_sha384_ecdsa_brainpoolP384r1 = 8,
  register_sha384_sha384_sha384_ecdsa_brainpoolP512r1 = 9,
  register_sha384_sha384_sha384_ecdsa_secp384r1 = 10,
  register_sha512_sha512_sha512_ecdsa_brainpoolP512r1 = 11,
  register_sha512_sha512_sha512_rsa_65537_4096 = 12,
  register_sha512_sha512_sha512_rsapss_65537_64_2048 = 13,
  register_sha1_sha1_sha1_rsa_65537_4096 = 14,
  register_sha1_sha256_sha256_rsa_65537_4096 = 15,
  register_sha224_sha224_sha224_ecdsa_brainpoolP224r1 = 16,
  register_sha256_sha224_sha224_ecdsa_secp224r1 = 17,
  register_sha256_sha256_sha256_ecdsa_brainpoolP256r1 = 18,
  register_sha1_sha1_sha1_ecdsa_brainpoolP224r1 = 19,
  register_sha384_sha384_sha384_rsapss_65537_48_2048 = 20,
  register_sha1_sha1_sha1_ecdsa_secp256r1 = 21,
  register_sha256_sha256_sha256_rsapss_65537_64_2048 = 22,
  register_sha512_sha512_sha256_rsa_65537_4096 = 23,
  register_sha512_sha512_sha512_ecdsa_secp521r1 = 24,
}

export enum DscVerifierId {
  dsc_sha1_ecdsa_brainpoolP256r1 = 0,
  dsc_sha1_rsa_65537_4096 = 1,
  dsc_sha256_ecdsa_brainpoolP256r1 = 2,
  dsc_sha256_ecdsa_brainpoolP384r1 = 3,
  dsc_sha256_ecdsa_secp256r1 = 4,
  dsc_sha256_ecdsa_secp384r1 = 5,
  dsc_sha256_ecdsa_secp521r1 = 6,
  dsc_sha256_rsa_65537_4096 = 7,
  dsc_sha256_rsapss_3_32_3072 = 8,
  dsc_sha256_rsapss_65537_32_3072 = 9,
  dsc_sha256_rsapss_65537_32_4096 = 10,
  dsc_sha384_ecdsa_brainpoolP384r1 = 11,
  dsc_sha384_ecdsa_brainpoolP512r1 = 12,
  dsc_sha384_ecdsa_secp384r1 = 13,
  dsc_sha512_ecdsa_brainpoolP512r1 = 14,
  dsc_sha512_ecdsa_secp521r1 = 15,
  dsc_sha512_rsa_65537_4096 = 16,
  dsc_sha512_rsapss_65537_64_4096 = 17,
  dsc_sha256_rsapss_3_32_4096 = 18,
  dsc_sha1_ecdsa_secp256r1 = 19,
}

export enum SignatureAlgorithmIndex {
  rsa_sha256_65537_2048 = 1,
  rsa_sha1_65537_2048 = 3,
  rsapss_sha256_65537_2048 = 4,
  ecdsa_sha1_secp256r1_256 = 7,
  ecdsa_sha256_secp256r1_256 = 8,
  ecdsa_sha384_secp384r1_384 = 9,
  rsa_sha256_65537_4096 = 10,
  rsa_sha1_65537_4096 = 11,
  rsapss_sha256_65537_4096 = 12,
  rsa_sha256_3_2048 = 13,
  rsa_sha256_65537_3072 = 14,
  rsa_sha512_65537_4096 = 15,
  rsapss_sha256_3_3072 = 16,
  rsapss_sha256_3_4096 = 17,
  rsapss_sha384_65537_3072 = 18,
  rsapss_sha256_65537_3072 = 19,
  ecdsa_sha256_brainpoolP256r1_256 = 21,
  ecdsa_sha384_brainpoolP384r1_384 = 22,
  ecdsa_sha256_secp384r1_384 = 23,
  ecdsa_sha384_brainpoolP256r1_256 = 24,
  ecdsa_sha512_brainpoolP256r1_256 = 25,
  ecdsa_sha512_brainpoolP384r1_384 = 26,
  ecdsa_sha1_brainpoolP224r1_224 = 27,
  ecdsa_sha256_brainpoolP224r1_224 = 28,
  ecdsa_sha512_brainpoolP512r1_512 = 29,
  ecdsa_sha224_brainpoolP224r1_224 = 30,
  rsa_sha256_3_4096 = 32,
  rsa_sha1_3_4096 = 33,
  rsa_sha384_65537_4096 = 34,
  rsapss_sha384_65537_4096 = 35,
  ecdsa_sha1_brainpoolP256r1_256 = 36,
  ecdsa_sha512_secp521r1_521 = 41,
}

export const attributeToPosition = {
  issuing_state: [2, 4],
  name: [5, 43],
  passport_number: [44, 52],
  nationality: [54, 56],
  date_of_birth: [57, 62],
  gender: [64, 64],
  expiry_date: [65, 70],
  older_than: [88, 89],
  ofac: [90, 90],
};

export const circuitToSelectorMode = {
  register: [0, 0],
  prove_onchain: [1, 0],
  prove_offchain: [1, 1],
};

export const revealedDataTypes = {
  issuing_state: 0,
  name: 1,
  passport_number: 2,
  nationality: 3,
  date_of_birth: 4,
  gender: 5,
  expiry_date: 6,
  older_than: 7,
  passport_no_ofac: 8,
  name_and_dob_ofac: 9,
  name_and_yob_ofac: 10,
};

export const CIRCUIT_CONSTANTS = {
  REGISTER_NULLIFIER_INDEX: 0,
  REGISTER_COMMITMENT_INDEX: 1,
  REGISTER_MERKLE_ROOT_INDEX: 2,

  DSC_TREE_LEAF_INDEX: 0,
  DSC_CSCA_ROOT_INDEX: 1,

  VC_AND_DISCLOSE_REVEALED_DATA_PACKED_INDEX: 0,
  VC_AND_DISCLOSE_FORBIDDEN_COUNTRIES_LIST_PACKED_INDEX: 3,
  VC_AND_DISCLOSE_NULLIFIER_INDEX: 7,
  VC_AND_DISCLOSE_ATTESTATION_ID_INDEX: 8,
  VC_AND_DISCLOSE_MERKLE_ROOT_INDEX: 9,
  VC_AND_DISCLOSE_CURRENT_DATE_INDEX: 10,
  VC_AND_DISCLOSE_PASSPORT_NO_SMT_ROOT_INDEX: 16,
  VC_AND_DISCLOSE_NAME_DOB_SMT_ROOT_INDEX: 17,
  VC_AND_DISCLOSE_NAME_YOB_SMT_ROOT_INDEX: 18,
  VC_AND_DISCLOSE_SCOPE_INDEX: 19,
  VC_AND_DISCLOSE_USER_IDENTIFIER_INDEX: 20,
};

export const MAX_BYTES_IN_FIELD = 31;
export const MAX_PUBKEY_DSC_BYTES = 525;

export const MAX_DATAHASHES_LEN = 320; // max formatted and concatenated datagroup hashes length in bytes
export const n_dsc = 120;
export const n_dsc_3072 = 120;
export const n_dsc_4096 = 120;
export const k_dsc = 35;
export const k_dsc_3072 = 35; //48;
export const k_dsc_4096 = 35;
export const n_csca = 120;
export const k_csca = 35;
export const n_dsc_ecdsa = 64;
export const k_dsc_ecdsa = 4;
export const max_dsc_bytes = 1792;
export const max_csca_bytes = 1792;

export const contribute_publicKey = `-----BEGIN RSA PUBLIC KEY-----
MIICCgKCAgEAv/hm7FZZ2KBmaeDHmLoRwuWmCcNKT561RqbsW8ZuYSyPWJUldE9U
Cf0lW3K1H5lsSDkl0Cq84cooL9f6X59Mffb/N24ZKTdL0xdcPwjk4LbcrVm8qubL
0a/4uCNoZZ1my4nxbpLxYtbr8CNmUGvBOVKf8IcjsY6VghIZrO63G6BN/G44su1Z
WcHpboGt9SDQK4enCyKxnCD+PbDYlewSA0n3GRajFfZex1bj1EvrS2hTLv8oNH5e
9H+3TUke0uO6Ttl0bZepoMmPlpAXhJByISqC6SLth4WFIH+G1I/xt9AEM7hOfLMl
KQv/3wlLEgEueRryKAHB2tqkaDKVJyw+tOyWj2iWA+nVgQKAxO4hOw01ljyVbcx6
KboXwnamlZPFIx4tjEaZ+ClXCFqvXhE9LDFK11QsYzJZl0aRVfTNqcurhEt7SK0f
qzOBhID0Nxk4k9sW1uT6ocW1xp1SB2WotORssOKIAOLJM8IbPl6n/DkYNcfvyXI7
4BlUrf6M2DgZMYATabIy94AvopHJOyiRfh4NpQPDntWnShiI1em2MmtXiWFCdVFV
6/QfJTKVixJpVfDh386ALXc97EPWDMWIalUwYoV/eRSMnuV8nZ0+Ctp3Qrtk/JYd
+FWhKbtlPeRjmGVr6mVlvDJ7KqtY5/RqqwfWeXhXezGhQqQ/OoQQCRkCAwEAAQ==
-----END RSA PUBLIC KEY-----`;

export const DEFAULT_RPC_URL = 'https://mainnet.optimism.io';
export const REGISTER_CONTRACT_ADDRESS = '0x3F346FFdC5d583e4126AF01A02Ac5b9CdB3f1909';
export const SBT_CONTRACT_ADDRESS = '0x601Fd54FD11C5E77DE84d877e55B829aff20f0A6';
