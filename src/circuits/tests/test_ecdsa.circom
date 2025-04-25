pragma circom 2.1.9;

include "../signature/ecdsaVerifier.circom";

template VerifyP521r1Sha512() {
    signal input signature[2 * 8];
    signal input pubKey[2 * 8];
    signal input hashParsed[512];

    EcdsaVerifier()(signature, pubKey, hashParsed);
}

component main = VerifyP521r1Sha512();