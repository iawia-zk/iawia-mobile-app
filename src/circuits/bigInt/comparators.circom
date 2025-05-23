pragma circom  2.1.6;

include "circomlib/circuits/comparators.circom";
include "circomlib/circuits/bitify.circom";
include "../utils/switcher.circom";


template BigIntIsZero(CHUNK_SIZE, MAX_CHUNK_SIZE, CHUNK_NUMBER) {
    assert(CHUNK_NUMBER >= 2);
    
    var EPSILON = 3;
    
    assert(MAX_CHUNK_SIZE + EPSILON <= 253);
    
    signal input in[CHUNK_NUMBER];
    
    signal carry[CHUNK_NUMBER - 1];
    component carryRangeChecks[CHUNK_NUMBER - 1];
    for (var i = 0; i < CHUNK_NUMBER - 1; i++){
        carryRangeChecks[i] = Num2Bits(MAX_CHUNK_SIZE + EPSILON - CHUNK_SIZE);
        if (i == 0){
            carry[i] <== in[i] / (1 << CHUNK_SIZE);
        }
        else {
            carry[i] <== (in[i] + carry[i - 1]) / (1 << CHUNK_SIZE);
        }
        // checking carry is in the range of - 2^(m-n-1+eps), 2^(m+-n-1+eps)
        carryRangeChecks[i].in <== carry[i] + (1 << (MAX_CHUNK_SIZE + EPSILON - CHUNK_SIZE - 1));
    }

    in[CHUNK_NUMBER - 1] + carry[CHUNK_NUMBER - 2] === 0;
}


template BigIntIsZeroModP(CHUNK_SIZE, MAX_CHUNK_SIZE, CHUNK_NUMBER, MAX_CHUNK_NUMBER, CHUNK_NUMBER_MODULUS){
    signal input in[CHUNK_NUMBER];
    signal input modulus[CHUNK_NUMBER_MODULUS];
    
    var CHUNK_NUMBER_DIV = MAX_CHUNK_NUMBER - CHUNK_NUMBER_MODULUS + 1;
    
    var reduced[200] = reduce_overflow_signed_dl(CHUNK_SIZE, CHUNK_NUMBER, MAX_CHUNK_NUMBER, MAX_CHUNK_SIZE, in);
    var div_result[2][200] = long_div_dl(CHUNK_SIZE, CHUNK_NUMBER_MODULUS, CHUNK_NUMBER_DIV - 1, reduced, modulus);
    signal sign <-- reduced[199];
    sign * (1 - sign) === 0;
    signal k[CHUNK_NUMBER_DIV];


    // range checks
    // why explained above
    // TODO: research last chunk check, maybe less bits will be enough
    component kRangeChecks[CHUNK_NUMBER_DIV];
    for (var i = 0; i < CHUNK_NUMBER_DIV; i++){
        k[i] <-- div_result[0][i];
        kRangeChecks[i] = Num2Bits(CHUNK_SIZE);
        kRangeChecks[i].in <-- k[i];
    }

    component mult;
    if (CHUNK_NUMBER_DIV >= CHUNK_NUMBER_MODULUS){
        mult = BigMultOverflow(CHUNK_SIZE, CHUNK_NUMBER_DIV, CHUNK_NUMBER_MODULUS);
        mult.in2 <== modulus;
        mult.in1 <== k;
    } else {
        mult = BigMultOverflow(CHUNK_SIZE, CHUNK_NUMBER_MODULUS, CHUNK_NUMBER_DIV);
        mult.in1 <== modulus;
        mult.in2 <== k;
    }
    
    component swicher[CHUNK_NUMBER];

    component isZero = BigIntIsZero(CHUNK_SIZE, MAX_CHUNK_SIZE, MAX_CHUNK_NUMBER);
    for (var i = 0; i < CHUNK_NUMBER; i++){
        swicher[i] = Switcher();
        swicher[i].in[0] <== in[i];
        swicher[i].in[1] <== -in[i];
        swicher[i].bool <== sign;

        isZero.in[i] <== mult.out[i] - swicher[i].out[1];
    }
    for (var i = CHUNK_NUMBER; i < MAX_CHUNK_NUMBER; i++){
        isZero.in[i] <== mult.out[i];
    }
    
}