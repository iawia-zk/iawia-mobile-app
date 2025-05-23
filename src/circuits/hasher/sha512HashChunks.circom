pragma circom 2.1.9;

include "common.circom";
include "sha512InitialValue.circom";
include "sha512Schedule.circom";
include "@zk-email/circuits/utils/array.circom";
include "sha512Rounds.circom";

template Sha512HashChunks(MAX_BLOCKS) {
    signal input in[MAX_BLOCKS * 1024];
    signal input paddedInLength;

    signal output out[512];

    signal inBlockIndex;

    inBlockIndex <-- (paddedInLength >> 10); 
    paddedInLength === inBlockIndex * 1024;
    
    signal states[MAX_BLOCKS + 1][8][64];
    
    component iv = Sha512InitialValue();
    iv.out ==> states[0];
    
    component sch[MAX_BLOCKS];
    component rds[MAX_BLOCKS];
    
    for (var m = 0; m < MAX_BLOCKS; m++) {
        
        sch[m] = Sha2_384_512Schedule();
        rds[m] = Sha2_384_512Rounds(80);
        
        for (var k = 0; k < 16; k++) {
            for (var i = 0; i < 64; i++) {
                sch[m].chunkBits[k][i] <== in[m * 1024 + k * 64 + (63 - i) ];
            }
        }
        
        sch[m].outWords ==> rds[m].words;
        
        rds[m].inpHash <== states[m  ];
        rds[m].outHash ==> states[m + 1];
    }
    
    component arraySelectors[512];
    for (var j = 0; j < 8; j++) {
        for (var i = 0; i < 64; i++){
            arraySelectors[j * 64 + i] = ItemAtIndex(MAX_BLOCKS + 1);
            for (var k = 0; k <= MAX_BLOCKS; k++) {
                arraySelectors[j * 64 + i].in[k] <== states[k][j][63 - i];
            }
            arraySelectors[j * 64 + i].index <== inBlockIndex;
            out[j * 64 + i] <== arraySelectors[j * 64 + i].out;
        }
    }
}
