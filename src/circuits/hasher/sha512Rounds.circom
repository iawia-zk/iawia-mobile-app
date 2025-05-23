pragma circom 2.1.9;

include "common.circom";
include "sha512Compress.circom";
include "sha512Round.circom";


template Sha2_384_512Rounds(n) {
    
    assert(n > 0);
    assert(n <= 80);
    
    signal input  words[n];
    signal input  inpHash[8][64];
    signal output outHash[8][64];
    
    
    signal  a [n + 1][64];
    signal  b [n + 1][64];
    signal  c [n + 1][64];
    signal  dd[n + 1];
    signal  e [n + 1][64];
    signal  f [n + 1][64];
    signal  g [n + 1][64];
    signal  hh[n + 1];
    
    signal ROUND_KEYS[80];
    component roundKeys = SHA2_384_512RoundKeys();
    ROUND_KEYS <== roundKeys.out;
    
    a[0] <== inpHash[0];
    b[0] <== inpHash[1];
    c[0] <== inpHash[2];
    
    e[0] <== inpHash[4];
    f[0] <== inpHash[5];
    g[0] <== inpHash[6];
    
    component sumDd = GetSumOfNElements(64);
    component sumHh = GetSumOfNElements(64);
    for (var i = 0; i < 64; i++) {
        sumDd.in[i] <== inpHash[3][i] * (1 << i);
        sumHh.in[i] <== inpHash[7][i] * (1 << i);
    }
    dd[0] <== sumDd.out;
    hh[0] <== sumHh.out;
    
    signal hashWords[8];
    component sum[8];
    for (var j = 0; j < 8; j++) {
        sum[j] = GetSumOfNElements(64);
        for (var i = 0; i < 64; i++) {
            sum[j].in[i] <== (1 << i) * inpHash[j][i];
        }
        hashWords[j] <== sum[j].out;
    }
    
    component compress[n];
    
    for (var k = 0; k < n; k++) {
        
        compress[k] = Sha2_384_512CompressInner();
        
        compress[k].inp <== words[k];
        compress[k].key <== ROUND_KEYS[k];

        
        compress[k].a <== a [k];
        compress[k].b <== b [k];
        compress[k].c <== c [k];
        compress[k].dd <== dd[k];
        compress[k].e <== e [k];
        compress[k].f <== f [k];
        compress[k].g <== g [k];
        compress[k].hh <== hh[k];
        
        compress[k].outA ==> a [k + 1];
        compress[k].outB ==> b [k + 1];
        compress[k].outC ==> c [k + 1];
        compress[k].outDD ==> dd[k + 1];
        compress[k].outE ==> e [k + 1];
        compress[k].outF ==> f [k + 1];
        compress[k].outG ==> g [k + 1];
        compress[k].outHH ==> hh[k + 1];
    }
    
    component modulo[8];
    for (var j = 0; j < 8; j++) {
        modulo[j] = GetLastNBits(64);
    }
    
    component sumA = GetSumOfNElements(64);
    component sumB = GetSumOfNElements(64);
    component sumC = GetSumOfNElements(64);
    component sumE = GetSumOfNElements(64);
    component sumF = GetSumOfNElements(64);
    component sumG = GetSumOfNElements(64);
    
    for (var i = 0; i < 64; i++) {
        sumA.in[i] <== (1 << i) * a[n][i];
        sumB.in[i] <== (1 << i) * b[n][i];
        sumC.in[i] <== (1 << i) * c[n][i];
        sumE.in[i] <== (1 << i) * e[n][i];
        sumF.in[i] <== (1 << i) * f[n][i];
        sumG.in[i] <== (1 << i) * g[n][i];
    }
    
    modulo[0].in <== hashWords[0] + sumA.out;
    modulo[1].in <== hashWords[1] + sumB.out;
    modulo[2].in <== hashWords[2] + sumC.out;
    modulo[3].in <== hashWords[3] + dd[n];
    modulo[4].in <== hashWords[4] + sumE.out;
    modulo[5].in <== hashWords[5] + sumF.out;
    modulo[6].in <== hashWords[6] + sumG.out;
    modulo[7].in <== hashWords[7] + hh[n];
    
    for (var j = 0; j < 8; j++) {
        modulo[j].out ==> outHash[j];
    }
    
}
