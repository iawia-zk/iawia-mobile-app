pragma circom 2.1.9;

include "../crypto/bitify/bytes.circom";
include "../crypto/bitify/split.circom";


template CheckPubkeysEqual(n, kScaled, MAX_CSCA_PUBKEY_LENGTH) {
    var kLengthFactor = 2;
    signal input csca_pubKey[kScaled];
    signal input extracted_csca_pubKey[MAX_CSCA_PUBKEY_LENGTH];
    signal input csca_pubKey_actual_size;

    signal csca_pubKey_bytes[MAX_CSCA_PUBKEY_LENGTH] <== WordsToBytes(n, kScaled, n * kScaled / 8)(csca_pubKey);

    // reverse bytes order
    signal reversed_csca_pubKey_bytes[MAX_CSCA_PUBKEY_LENGTH];
    for (var i = 0; i < MAX_CSCA_PUBKEY_LENGTH; i++) {
        reversed_csca_pubKey_bytes[i] <== csca_pubKey_bytes[MAX_CSCA_PUBKEY_LENGTH - i - 1];
    }

    signal shifted_csca_pubKey_bytes[MAX_CSCA_PUBKEY_LENGTH] <== VarShiftLeft(MAX_CSCA_PUBKEY_LENGTH, MAX_CSCA_PUBKEY_LENGTH)(
        reversed_csca_pubKey_bytes,
        MAX_CSCA_PUBKEY_LENGTH - csca_pubKey_actual_size
    );

    
    for (var i = 0; i < MAX_CSCA_PUBKEY_LENGTH / 2; i++) {
        shifted_csca_pubKey_bytes[i] === extracted_csca_pubKey[MAX_CSCA_PUBKEY_LENGTH / 2 + i];
    }

    for (var i = 0; i < MAX_CSCA_PUBKEY_LENGTH / 2; i++) {
        shifted_csca_pubKey_bytes[MAX_CSCA_PUBKEY_LENGTH / 2 + i] === extracted_csca_pubKey[i];
    }
    
}