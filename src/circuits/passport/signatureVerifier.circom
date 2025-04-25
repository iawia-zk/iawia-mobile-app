pragma circom 2.1.9;


include "../signature/ecdsaVerifier.circom";
include "@openpassport/zk-email-circuits/utils/bytes.circom";

template SignatureVerifier() {
    var n = 66;
    var k = 8;
    var kLengthFactor = 2;
    var kScaled = k * kLengthFactor;

    var HASH_LEN_BITS = 512;

    signal input hash[HASH_LEN_BITS];
    signal input pubKey[kScaled];
    signal input signature[kScaled];

    var msg_len = (HASH_LEN_BITS + n - 1) \ n;

    signal hashParsed[msg_len] <== HashParser()(hash);
   
    
     
    EcdsaVerifier()(signature, pubKey, hash);
    
}


template HashParser() {
    var n = 66;
    var k = 8;
    var HASH_LEN_BITS = 512;
    var msg_len = (HASH_LEN_BITS + n - 1) \ n;

    component hashParser[msg_len];
    signal input hash[HASH_LEN_BITS];

    for (var i = 0; i < msg_len; i++) {
        hashParser[i] = Bits2Num(n);
    }
    for (var i = 0; i < HASH_LEN_BITS; i++) {
        hashParser[i \ n].in[i % n] <== hash[HASH_LEN_BITS - 1 - i];
    }
    for (var i = HASH_LEN_BITS; i < n * msg_len; i++) {
        hashParser[i \ n].in[i % n] <== 0;
    }
    signal output hashParsed[msg_len];
    for (var i = 0; i < msg_len ; i++ ){
        hashParsed[i] <== hashParser[i].out;
    }
}