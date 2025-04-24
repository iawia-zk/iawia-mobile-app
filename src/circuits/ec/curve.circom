pragma circom 2.1.9;

include "../bigInt/bigIntFunc.circom";
include "../bigInt/bigint.circom";
include "../bigInt/overflow.circom";
include "../bigInt/helpers.circom";
include "./get.circom";
include "./powers.circom";
include "../utils/switcher.circom";
include "circomlib/circuits/bitify.circom";
include "circomlib/circuits/comparators.circom";
include "../bigInt/arithmetic.circom";


template PointOnCurve(A,B,P){

    
    var n = 66;
    var k = 8;
    signal input in[2][k];

    component square = BigMultOverflow(n, k, k);
    square.in1 <== in[0];
    square.in2 <== in[0];

    component cube = BigMultOverflow(n, k * 2 - 1, k);
    cube.in1 <== square.out;
    cube.in2 <== in[0];

    component ySquare = BigMultOverflow(n, k, k);
    ySquare.in1 <== in[1];
    ySquare.in2 <== in[1];

    component ax = BigMultOverflow(n, k, k);
    ax.in1 <== in[0];
    ax.in2 <== A;

    // check if y^2 - (x^3 + a * x + b) == 0  mod p
    compare isZeroCongruent = BigIntIsZeroModP(n, n * 3 + 2 * k, k * 3 - 2, k * 3, k);

    for(var i = 0; i < k; i++){
        isZeroCongruent.in[i] <== cube.out[i] + ax.out[i] - ySquare.out[i] + B[i];
    }
    for(var i = k; i < k * 2 - 1; i++){
        isZeroCongruent.in[i] <== cube.out[i] + ax.out[i] - ySquare.out[i];
    }
    for(var i = k * 2 - 1; i < k * 3 - 2; i++){
        isZeroCongruent.in[i] <== cube.out[i] ;
    }
    isZeroCongruent.modulus <== P;
}

template PointOnTangent(A,B,P){
    var n = 66;
    var k = 8;
    
    signal input in1[2][k];
    signal input in2[2][k];

    component square = BigMultOverflow(n, k, k);
    square.in1 <== in1[0];
    square.in2 <== in1[0];


    component scalar = ScalarMultOverflow(k*2 -1);
    scalar.in <== square.out;
    scalar.scalar <== 3;

    component bigAdd = BigAddOverflow(n, k * 2 - 1, k);
    bigAdd.in1 <== scalar.out;
    bigAdd.in2 <== A;

    component bigSub = BigSubModP(n, k);
    bigSub.in1 <== in1[0];
    bigSub.in2 <== in2[0];
    bigSub.modulus <== P;

    component rightMult = BigMultOverflow(n, k * 2 - 1, k);
    rightMult.in1 <== bigAdd.out;
    rightMult.in2 <== bigSub.out;

    component scalar2 = ScalarMultOverflow(k);
    scalarMult2.in <== in1[1];
    scalarMult2.scalar <== 2;

    // Compute y3 + y
    component bigAdd2 = BigAddOverflow(n, k, k);
    bigAdd2.in1 <== in1[1];
    bigAdd2.in2 <== in2[1];

    // Compute 2 * y * (y3 + y)
    component leftMult = BigMultOverflow(n, k, k);
    leftMult.in1 <== bigAdd2.out;
    leftMult.in2 <== scalar2.out;

    component isZeroModP = BigIntIsZeroModP(n, n * 3 + 2 * k, k * 3 - 2, k * 3 + 1, k);
    for(var i = 0; i < k * 2 - 1; i++){
        isZeroModP.in[i] <== rightMult.out[i] - leftMult.out[i];
    }

    for(var i = k * 2 - 1; i < k * 3 - 2; i++){
        isZeroModP.in[i] <== rightMult.out[i];
    }

    isZeroModP.modulus <== P;

}


template PointOnLine(A, B, P) {

    var n = 66;
    var k = 8;
    signal input in1[2][k];
    signal input in2[2][k];
    signal input in3[2][k];
    
    // Compute y1 + y3
    component bigAdd = BigAddOverflow(n, k, k);
    bigAdd.in1 <== in1[1];
    bigAdd.in2 <== in3[1];
    
    // Compute x2 - x1
    component bigSub = BigSubModP(n, k);
    bigSub.in1 <== in2[0];
    bigSub.in2 <== in1[0];
    bigSub.modulus <== P;
    
    // Compute y2 - y1
    component bigSub2 = BigSubModP(n, k);
    bigSub2.in1 <== in2[1];
    bigSub2.in2 <== in1[1];
    bigSub2.modulus <== P;
    
    // Compute x1 - x3
    component bigSub3 = BigSubModP(n, k);
    bigSub3.in1 <== in1[0];
    bigSub3.in2 <== in3[0];
    bigSub3.modulus <== P;
    
    // Compute (y1 + y3) * (x2 - x1)
    component leftMult = BigMultOverflow(n, k, k);
    leftMult.in1 <== bigAdd.out;
    leftMult.in2 <== bigSub.out;
    
    // Compute (y2 - y1) * (x1 - x3)
    component rightMult = BigMultOverflow(n, k, k);
    rightMult.in1 <== bigSub2.out;
    rightMult.in2 <== bigSub3.out;
    
    // Verify if (y1 + y3) * (x2 - x1) == (y2 - y1) * (x1 - x3) mod P
    component isZeroModP = BigIntIsZeroModP(n, n * 2 + 2 * k, k * 2 - 1, k * 2 + 1, k);
    for (var i = 0; i < k * 2 - 1; i++){
        isZeroModP.in[i] <== leftMult.out[i] - rightMult.out[i];
    }
    
    isZeroModP.modulus <== P;
}

template EllipticCurvePrecomputePipinger(A, B, P, WINDOW_SIZE){
    var n = 66;
    var k = 8;

    signal input in[2][k];
    
    var PRECOMPUTE_NUMBER = 2 ** WINDOW_SIZE;
    
    signal output out[PRECOMPUTE_NUMBER][2][k];
    
    // Initialize the point for 0 * G (dummy point)
    component getDummy = EllipticCurveGetDummy(n, k, A, B, P);
    out[0] <== getDummy.dummyPoint;
    
    // Initialize the point for 1 * G (base point)
    out[1] <== in;
    
    // Precompute the remaining points using doubling and addition
    component doublers[PRECOMPUTE_NUMBER \ 2 - 1];
    component adders  [PRECOMPUTE_NUMBER \ 2 - 1];
    
    for (var i = 2; i < PRECOMPUTE_NUMBER; i++){
        if (i % 2 == 0){
            doublers[i \ 2 - 1] = EllipticCurveDouble(n, k, A, B, P);
            doublers[i \ 2 - 1].in <== out[i \ 2];
            doublers[i \ 2 - 1].out ==> out[i];
            
        }
        else {
            adders[i \ 2 - 1] = EllipticCurveAdd(n, k, A, B, P);
            adders[i \ 2 - 1].in1 <== out[1];
            adders[i \ 2 - 1].in2 <== out[i - 1];
            adders[i \ 2 - 1].out ==> out[i];
        }
    }
}

template EllipticCurveDouble( A, B, P){
    var n = 66;
    var k = 8;
    signal input in[2][k];
    signal output out[2][k];
    

    var long_3[k];
    long_3[0] = 3;
    // Precompute λ numerator: (3 * x^2 + a)
    var lamb_num[200] = long_add_mod_dl(n, k, A, prod_mod_dl(n, k, long_3, prod_mod_dl(n, k, in[0], in[0], P), P), P);
    // Compute λ denominator: (2 * y)
    var lamb_denom[200] = long_add_mod_dl(n, k, in[1], in[1], P);
    // Compute λ: (lamb_num / lamb_denom) mod P
    var lamb[200] = prod_mod_dl(n, k, lamb_num, mod_inv_dl(n, k, lamb_denom, P), P);
    // Compute x3 = λ^2 - 2 * x
    var x3[200] = long_sub_mod_dl(n, k, prod_mod_dl(n, k, lamb, lamb, P), long_add_mod_dl(n, k, in[0], in[0], P), P);
    // Compute y3 = λ * (x - x3) - y
    var y3[200] = long_sub_mod_dl(n, k, prod_mod_dl(n, k, lamb, long_sub_mod_dl(n, k, in[0], x3, P), P), in[1], P);
    
    for (var i = 0; i < k; i++){
        out[0][i] <-- x3[i];
        out[1][i] <-- y3[i];
    }
    
    // Check if the resulting point lies on the tangent
    component onTangentCheck = PointOnTangent(n, k, A, B, P);
    onTangentCheck.in1 <== in;
    onTangentCheck.in2 <== out;
    // Check if the resulting point lies on the curve
    component onCurveCheck = PointOnCurve(n, k, A, B, P);
    onCurveCheck.in <== out;

}


template EllipticCurveAdd(A, B, P){
    var n = 66;
    var k = 8;
    signal input in1[2][k];
    signal input in2[2][k];
    
    signal output out[2][k];
    
    // Compute the slope λ = (y2 - y1) / (x2 - x1)
    var dy[200] = long_sub_mod_dl(n, k, in2[1], in1[1], P);
    var dx[200] = long_sub_mod_dl(n, k, in2[0], in1[0], P);
    var dx_inv[200] = mod_inv_dl(n, k, dx, P);
    var lambda[200] = prod_mod_dl(n, k, dy, dx_inv, P);
    var lambda_sq[200] = prod_mod_dl(n, k, lambda, lambda, P);
    // Compute x3 = λ^2 - x1 - x2
    var x3[200] = long_sub_mod_dl(n, k, long_sub_mod_dl(n, k, lambda_sq, in1[0], P), in2[0], P);
    // Compute y3 = λ * (x1 - x3) - y1
    var y3[200] = long_sub_mod_dl(n, k, prod_mod_dl(n, k, lambda, long_sub_mod_dl(n, k, in1[0], x3, P), P), in1[1], P);
    
    for (var i = 0; i < k; i++){
        out[0][i] <-- x3[i];
        out[1][i] <-- y3[i];
    }
    
    // Check if the resulting point lies on the elliptic curve
    component onCurveCheck = PointOnCurve(n, k, A, B, P);
    onCurveCheck.in <== out;
    
    // Check if the points (x1, y1), (x2, y2), and (x3, -y3) are collinear
    component onLineCheck = PointOnLine(n, k, A, B, P);
    onLineCheck.in1 <== in1;
    onLineCheck.in2 <== in2;
    onLineCheck.in3 <== out;
    
}

template EllipticCurveScalarMult(A, B, P, WINDOW_SIZE){
    
    signal input in[2][k];
    signal input scalar[k];
    
    signal output out[2][k];
    
    component precompute = EllipticCurvePrecomputePipinger(n, k, A, B, P, WINDOW_SIZE);
    precompute.in <== in;
    
    
    var PRECOMPUTE_NUMBER = 2 ** WINDOW_SIZE;
    var DOUBLERS_NUMBER = n * k - WINDOW_SIZE;
    var ADDERS_NUMBER = n * k \ WINDOW_SIZE;
    
    
    component doublers[DOUBLERS_NUMBER];
    component adders  [ADDERS_NUMBER - 1];
    component bits2Num[ADDERS_NUMBER];
    component num2Bits[k];
    
    component getDummy = EllipticCurveGetDummy(n, k, A, B, P);
    
    signal scalarBits[k * n];
    
    for (var i = 0; i < k; i++){
        num2Bits[i] = Num2Bits(n);
        num2Bits[i].in <== scalar[i];
        for (var j = 0; j < n; j++){
            scalarBits[k * n - n * (i + 1) + j] <== num2Bits[i].out[n - 1 - j];
        }
    }
    
    signal resultingPoints[ADDERS_NUMBER + 1][2][k];
    signal additionPoints[ADDERS_NUMBER][2][k];
    
    
    component isZeroResult[ADDERS_NUMBER];
    component isZeroAddition[ADDERS_NUMBER];
    
    component partsEqual[ADDERS_NUMBER][PRECOMPUTE_NUMBER];
    component getSum[ADDERS_NUMBER][2][k];
    
    
    component doubleSwitcher[DOUBLERS_NUMBER][2][k];
    
    component resultSwitcherAddition[DOUBLERS_NUMBER][2][k];
    component resultSwitcherDoubling[DOUBLERS_NUMBER][2][k];
    
    resultingPoints[0] <== precompute.out[0];
    
    for (var i = 0; i < k * n; i += WINDOW_SIZE){
        bits2Num[i \ WINDOW_SIZE] = Bits2Num(WINDOW_SIZE);
        for (var j = 0; j < WINDOW_SIZE; j++){
            bits2Num[i \ WINDOW_SIZE].in[j] <== scalarBits[i + (WINDOW_SIZE - 1) - j];
        }
        
        isZeroResult[i \ WINDOW_SIZE] = IsEqual();
        isZeroResult[i \ WINDOW_SIZE].in[0] <== resultingPoints[i \ WINDOW_SIZE][0][0];
        isZeroResult[i \ WINDOW_SIZE].in[1] <== getDummy.dummyPoint[0][0];
        
        if (i != 0){
            for (var j = 0; j < WINDOW_SIZE; j++){
                doublers[i + j - WINDOW_SIZE] = EllipticCurveDouble(n, k, A, B, P);
                
                // if input == 0, double gen, result - zero
                // if input != 0, double res window times, result - doubling result
                if (j == 0){
                    for (var axis_idx = 0; axis_idx < 2; axis_idx++){
                        for (var coor_idx = 0; coor_idx < k; coor_idx++){
                            
                            doubleSwitcher[i \ WINDOW_SIZE - 1][axis_idx][coor_idx] = Switcher();
                            doubleSwitcher[i \ WINDOW_SIZE - 1][axis_idx][coor_idx].bool <== isZeroResult[i \ WINDOW_SIZE].out;
                            doubleSwitcher[i \ WINDOW_SIZE - 1][axis_idx][coor_idx].in[0] <== getDummy.dummyPoint[axis_idx][coor_idx];
                            doubleSwitcher[i \ WINDOW_SIZE - 1][axis_idx][coor_idx].in[1] <== resultingPoints[i \ WINDOW_SIZE][axis_idx][coor_idx];
                            
                            doublers[i + j - WINDOW_SIZE].in[axis_idx][coor_idx] <== doubleSwitcher[i \ WINDOW_SIZE - 1][axis_idx][coor_idx].out[1];
                        }
                    }
                }
                else {
                    doublers[i + j - WINDOW_SIZE].in <== doublers[i + j - 1 - WINDOW_SIZE].out;
                }
            }
        }
        
        // Setting components
        for (var axis_idx = 0; axis_idx < 2; axis_idx++){
            for (var coor_idx = 0; coor_idx < k; coor_idx++){
                getSum[i \ WINDOW_SIZE][axis_idx][coor_idx] = GetSumOfNElements(PRECOMPUTE_NUMBER);
            }
        }
        
        // Each sum is sum of all precomputed coordinates * isEqual result (0 + 0 + 1 * coordinate[][] + .. + 0)
        
        for (var point_idx = 0; point_idx < PRECOMPUTE_NUMBER; point_idx++){
            partsEqual[i \ WINDOW_SIZE][point_idx] = IsEqual();
            partsEqual[i \ WINDOW_SIZE][point_idx].in[0] <== point_idx;
            partsEqual[i \ WINDOW_SIZE][point_idx].in[1] <== bits2Num[i \ WINDOW_SIZE].out;
            for (var axis_idx = 0; axis_idx < 2; axis_idx++){
                for (var coor_idx = 0; coor_idx < k; coor_idx++){
                    getSum[i \ WINDOW_SIZE][axis_idx][coor_idx].in[point_idx] <== partsEqual[i \ WINDOW_SIZE][point_idx].out * precompute.out[point_idx][axis_idx][coor_idx];
                }
            }
        }
        
        // Setting results in point
        for (var axis_idx = 0; axis_idx < 2; axis_idx++){
            for (var coor_idx = 0; coor_idx < k; coor_idx++){
                additionPoints[i \ WINDOW_SIZE][axis_idx][coor_idx] <== getSum[i \ WINDOW_SIZE][axis_idx][coor_idx].out;
            }
        }
        
        if (i == 0){
            
            resultingPoints[i \ WINDOW_SIZE + 1] <== additionPoints[i \ WINDOW_SIZE];
            
        } else {
            adders[i \ WINDOW_SIZE - 1] = EllipticCurveAdd(n, k, A, B, P);
            adders[i \ WINDOW_SIZE - 1].in1 <== doublers[i - 1].out;
            adders[i \ WINDOW_SIZE - 1].in2 <== additionPoints[i \ WINDOW_SIZE];
            
            isZeroAddition[i \ WINDOW_SIZE] = IsEqual();
            isZeroAddition[i \ WINDOW_SIZE].in[0] <== additionPoints[i \ WINDOW_SIZE][0][0];
            isZeroAddition[i \ WINDOW_SIZE].in[1] <== getDummy.dummyPoint[0][0];
            
            // isZeroAddition / isZeroResult
            // 0 0 -> adders Result
            // 0 1 -> additionPoints
            // 1 0 -> doubling result
            // 1 1 -> 0
            
            for (var axis_idx = 0; axis_idx < 2; axis_idx++){
                for (var coor_idx = 0; coor_idx < k; coor_idx++){
                    resultSwitcherAddition[i \ WINDOW_SIZE - 1][axis_idx][coor_idx] = Switcher();
                    resultSwitcherDoubling[i \ WINDOW_SIZE - 1][axis_idx][coor_idx] = Switcher();
                    
                    resultSwitcherAddition[i \ WINDOW_SIZE - 1][axis_idx][coor_idx].bool <== isZeroAddition[i \ WINDOW_SIZE].out;
                    resultSwitcherAddition[i \ WINDOW_SIZE - 1][axis_idx][coor_idx].in[0] <== adders[i \ WINDOW_SIZE - 1].out[axis_idx][coor_idx];
                    resultSwitcherAddition[i \ WINDOW_SIZE - 1][axis_idx][coor_idx].in[1] <== doublers[i - 1].out[axis_idx][coor_idx];
                    
                    resultSwitcherDoubling[i \ WINDOW_SIZE - 1][axis_idx][coor_idx].bool <== isZeroResult[i \ WINDOW_SIZE].out;
                    resultSwitcherDoubling[i \ WINDOW_SIZE - 1][axis_idx][coor_idx].in[0] <== additionPoints[i \ WINDOW_SIZE][axis_idx][coor_idx];
                    resultSwitcherDoubling[i \ WINDOW_SIZE - 1][axis_idx][coor_idx].in[1] <== resultSwitcherAddition[i \ WINDOW_SIZE - 1][axis_idx][coor_idx].out[0];
                    
                    resultingPoints[i \ WINDOW_SIZE + 1][axis_idx][coor_idx] <== resultSwitcherDoubling[i \ WINDOW_SIZE - 1][axis_idx][coor_idx].out[1];
                }
            }
        }
    }
    out <== resultingPoints[ADDERS_NUMBER];
}