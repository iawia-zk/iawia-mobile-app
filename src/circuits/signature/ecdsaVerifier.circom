
// y^2 = x^3 + ax + b mod p

pragma circom 2.1.9;


// hash length 512
// min key length 528
// K length factor 2
include "../passport/signatureAlgorithm.circom";
include "../bigInt/bigInt.circom";
include "ecdsa.circom";



template EcdsaVerifier(){
    var n = 66;
    var k = 8;
    var kLengthFactor = 2;
    var kScaled = k * kLengthFactor;

    var HASH_LEN_BITS = 512;

    signal input signature[kScaled];
    signal input pubkey[kScaled];
    signal input message[HASH_LEN_BITS];

    signal hash[n*k];
    
    //if hash is  greater than finite field
    if(HASH_LEN_BITS >= n*k){
        for(var i = 0; i < n*k; i++){
            hash[i] <== message[i];
        }
    }

    //if hash is less than finite field

    if(HASH_LEN_BITS < n*k){
        for(var i = n * k - 1; i >= 0; i--){
            if(i <= n * k - 1 - HASH_LEN_BITS){
                hash[i] <== 0;
            }else{
                hash[i] <== message[i - n * k + HASH_LEN_BITS];
            }
        }
    }

    signal signature_r[k]; //ECDSA sig r
    signal signature_s[k]; //ECDSA sig s
    signal pubkey_x[k]; //pubkey x
    signal pubkey_y[k]; //pubkey y

    for(var i = 0; i < k; i++){
        signature_r[i] <== signature[i];
        signature_s[i] <== signature[i + k];
        pubkey_x[i] <== pubkey[i];
        pubkey_y[i] <== pubkey[i + k];
    }
    signal pubkey_xy[2][k] <== [pubkey_x, pubkey_y];

    var a[k] = get_a();
    var b[k] = get_b();
    var p[k] = get_p();

    component ecdsa_verify = verifyBits(a,b,p);

    component rangeCheck[4 * k]; 
    for (var i = 0; i < k; i++) { 
        rangeCheck[4 * i + 0] = Num2Bits(n);
        rangeCheck[4 * i + 1] = Num2Bits(n);
        rangeCheck[4 * i + 2] = Num2Bits(n);
        rangeCheck[4 * i + 3] = Num2Bits(n);

        rangeCheck[4 * i + 0].in <== signature_r[i];
        rangeCheck[4 * i + 1].in <== signature_s[i];
        rangeCheck[4 * i + 2].in <== pubkey_x[i];
        rangeCheck[4 * i + 3].in <== pubkey_y[i];
    }

    ecdsa_verify.pubkey <== pubkey_xy;
    ecdsa_verify.signature <== [signature_r, signature_s];
    ecdsa_verify.hashed <== hash;
}





function get_a(){
    return [
            73786976294838206460,
            73786976294838206463,
            73786976294838206463,
            73786976294838206463,
            73786976294838206463,
            73786976294838206463,
            73786976294838206463,
            576460752303423487
        ];
}

function get_b(){
    return [
            35687965819361312512,
            33244719099633405244,
            68122903767798193136,
            64948772962036742733,
            36008729323586384137,
            4298886627987975365,
            30118149759215298644,
            91854278977009778
        ];
}

function get_p(){
    return [
            73786976294838206463,
            73786976294838206463,
            73786976294838206463,
            73786976294838206463,
            73786976294838206463,
            73786976294838206463,
            73786976294838206463,
            576460752303423487
        ];
}