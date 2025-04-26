pragma circom 2.1.9;

include "./sha512HashChunks.circom";
include "./sha512HashBits.circom";

//------------------------------------------------------------------------------------------------------------------------------------------------------------
// Here is secure implementation of sha-1 and sha-2 hash algoritms.
// There are two versions of hashers - for bits and chunks
// Bit implementation do padding by itself, so use it if u don`t understand how padding works.
// Chunk implementation is hashing already padded message, use it if u want to have 1 circuit for many cases of input len,
// but u should do padding in off-circuit computations.
// BLOCK_NUM or LEN is len in blocks or bits of message, algo is hash algo we should use (list below \/\/\/)
// We don`t waste constraints for many hashers in one template because we know what algo will be at the moment of compilation
// List of ALGO:
// Sha1:     160
// Sha2-224: 224
// Sha2-256: 256
// Sha2-384: 384
// Sha2-512: 512
template ShaHashChunks(BLOCK_NUM){

    
    var BLOCK_SIZE = 1024;
    
    signal input in[BLOCK_SIZE * BLOCK_NUM];
    signal output out[512];

    
    component hash512 = Sha512HashChunks(BLOCK_NUM);
    hash512.in <== in;
    hash512.out ==> out;
    
}

template ShaHashBits(LEN){


    var BLOCK_SIZE = 1024;
    
    signal input in[LEN];
    signal output out[512];

    
    component hash512 = Sha512HashBits(LEN);
    hash512.in <== in;
    hash512.out ==> out;
    
}
