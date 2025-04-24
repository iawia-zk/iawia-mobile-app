pragma circom  2.1.9;

include "../../ec/curve.circom";
include "../../ec/get.circom";
include "../../bigInt/bigInt.circom";

template verifyBits(A, B, P){

    var n = 66;
    var k = 8;
    signal input pubkey[2][k];

    signal input signature[2][k];
    signal input hashed[n*k];

    signal hashedChunked[k];

    component bits2Num[k];

    for(var i = 0; i < k; i++){
        bits2Num[i] = Bits2Num(n, k);
        for(var j = 0; j < n; j++){
            bits2Num[i].in[n - 1 - j] <== hashed[i * n + j];
        }
        hashedChunked[k - 1 - i] <== bits2Num[i].out;
    }

    signal one[k];

    one[0] <== 1;

    for (var i = 1; i < k; i++){
        one[i] <== 0;
    }


    component getOrder = EllipticCurveGetOrder(n, k, A, B, P);
    signal order[k];
    order <== getOrder.order;

    component rangeChecks[2];
    rangeChecks[0] = RangeCheck(n, k);
    rangeChecks[0].value <== signature[0];
    rangeChecks[0].min <== one;
    rangeChecks[0].max <== order;
    rangeChecks[0].out === 1;

    rangeChecks[1] = RangeCheck(n, k);
    rangeChecks[1].value <== signature[1];
    rangeChecks[1].min <== one;
    rangeChecks[1].max <== order;
    rangeChecks[1].out === 1;

    signal sinv[k];

    component modInv = BigModInv(n,k);

    modInv.in <== signature[1];
    modInv.mod <== order;
    modInv.out ==> sinv;

    component mult = BigMultModP(n, k, k, k);
    mult.in1 <== sinv;
    mult.in2 <== hashedChunked;
    mult.mod <== order;

    component mult2 = BigMultModP(n, k, k, k);
    mult2.in1 <== sinv;
    mult2.in2 <== signature[0];
    mult2.mod <== order;


    //might be problematic
    component scalarMult1 = EllipicCurveScalarGeneratorMult(n, k, A, B, P);
    scalarMult1.scalar <== mult.mod;


    component scalarMult2 = EllipticCurveScalarMult(n, k, A, B, P, 4);
    scalarMult2.scalar <== mult2.mod;
    scalarMult2.in <== pubkey;

    component add = EllipticCurveAdd(n, k, A, B, P);
    add.in1 <== scalarMult1.out;
    add.in2 <== scalarMult2.out;

    component addModN = BigMultModP(n, k, k, k);
    addModN.in1 <== add.out[0];
    addModN.in2 <== one;
    addModN.modulus <== order;

    for(var i = 0; i < k; i++){
        addModN.mod[i] === signature[0][i];
    }

}
