export type Mode = 'register' | 'dsc' | 'vc_and_disclose';

export const CIRCUIT_TYPES = ['dsc', 'register', 'vc_and_disclose'];

export const circuitNameFromMode = {
  prove: 'prove',
  prove_onchain: 'prove',
  prove_offchain: 'prove',
  register: 'prove',
  vc_and_disclose: 'vc_and_disclose',
  dsc: 'dsc',
};

export const hashAlgos = ['sha512', 'sha384', 'sha256', 'sha224', 'sha1'];

export const max_dsc_bytes = 1792;
export const max_csca_bytes = 1792;

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

export const PASSPORT_ATTESTATION_ID = '1'; //"8518753152044246090169372947057357973469996808638122125210848696986717482788"
