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
            doublers[i \ 2 - 1] = EllipticCurveDouble(A, B, P);
            doublers[i \ 2 - 1].in <== out[i \ 2];
            doublers[i \ 2 - 1].out ==> out[i];
            
        }
        else {
            adders[i \ 2 - 1] = EllipticCurveAdd( A, B, P);
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
    component onTangentCheck = PointOnTangent( A, B, P);
    onTangentCheck.in1 <== in;
    onTangentCheck.in2 <== out;
    // Check if the resulting point lies on the curve
    component onCurveCheck = PointOnCurve( A, B, P);
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
    component onCurveCheck = PointOnCurve(A, B, P);
    onCurveCheck.in <== out;
    
    // Check if the points (x1, y1), (x2, y2), and (x3, -y3) are collinear
    component onLineCheck = PointOnLine(A, B, P);
    onLineCheck.in1 <== in1;
    onLineCheck.in2 <== in2;
    onLineCheck.in3 <== out;
    
}

template EllipticCurveScalarMult(A, B, P, WINDOW_SIZE){
    
    signal input in[2][k];
    signal input scalar[k];
    
    signal output out[2][k];
    
    component precompute = EllipticCurvePrecomputePipinger(A, B, P, WINDOW_SIZE);
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
                doublers[i + j - WINDOW_SIZE] = EllipticCurveDouble( A, B, P);
                
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
            adders[i \ WINDOW_SIZE - 1] = EllipticCurveAdd(A, B, P);
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



/// @title EllipicCurveScalarGeneratorMult
/// @notice Calculates the elliptic curve scalar multiplication: G * scalar
/// @dev This function works for multiple elliptic curve types. The generator power tables for each curve are pre-generated. It performs the scalar multiplication in chunks using the specified chunk size and number of chunks.
/// @param n The size of each chunk used for scalar multiplication. 
/// @param k The number of chunks used for scalar multiplication. 
/// @param A The curve parameter A (used for curve equation: y^2 = x^3 + Ax + B).
/// @param B The curve parameter B (used for curve equation: y^2 = x^3 + Ax + B).
/// @param P The elliptic curve parameters [P0, P1, P2, P3] defining the curve.
/// @return out The resulting elliptic curve point after multiplying the generator G with the scalar.
template EllipicCurveScalarGeneratorMult( A, B, P){
    var n = 66;
    var k = 8;
    signal input scalar[k];
    
    signal output out[2][k];
    
    var STRIDE = 8;
    var parts = k * n \ STRIDE;
    
    var powers[parts][2 ** STRIDE][2][k];
    
    
    
    if (P[0] == 73786976294838206463 && P[1] == 73786976294838206463 && P[2] == 73786976294838206463 && P[3] == 73786976294838206463 && P[4] == 73786976294838206463 && P[5] == 73786976294838206463 && P[6] == 73786976294838206463 && P[7] == 576460752303423487){
        powers = get_g_pow_stride8_table_p521(n, k);
    }
    
    
    
    
    component num2bits[k];
    for (var i = 0; i < k; i++){
        num2bits[i] = Num2Bits(n);
        num2bits[i].in <== scalar[i];
    }
    component bits2num[parts];
    for (var i = 0; i < parts; i++){
        bits2num[i] = Bits2Num(STRIDE);
        for (var j = 0; j < STRIDE; j++){
            bits2num[i].in[j] <== num2bits[(i * STRIDE + j) \ n].out[(i * STRIDE + j) % n];
        }
    }

    component getDummy = EllipticCurveGetDummy(n, k, A, B, P);
    component getSecondDummy = EllipticCurveDouble( A, B, P);
    getSecondDummy.in <== getDummy.dummyPoint;

    component equal[parts][2 ** STRIDE];
    signal resultCoordinateComputation[parts][2 ** STRIDE][2][k];
    for (var i = 0; i < parts; i++){
        for (var j = 0; j < 2 ** STRIDE; j++){
            equal[i][j] = IsEqual();
            equal[i][j].in[0] <== j;
            equal[i][j].in[1] <== bits2num[i].out;
            
            if (j == 0 && i % 2 == 0){
                for (var axis_idx = 0; axis_idx < k; axis_idx++){
                    resultCoordinateComputation[i][j][0][axis_idx] <== equal[i][j].out * getDummy.dummyPoint[0][axis_idx];
                }
                for (var axis_idx = 0; axis_idx < k; axis_idx++){
                    resultCoordinateComputation[i][j][1][axis_idx] <== equal[i][j].out * getDummy.dummyPoint[1][axis_idx];
                }
            }
            if (j == 0 && i % 2 == 1){
                for (var axis_idx = 0; axis_idx < k; axis_idx++){
                    resultCoordinateComputation[i][j][0][axis_idx] <== equal[i][j].out * getSecondDummy.out[0][axis_idx];
                }
                for (var axis_idx = 0; axis_idx < k; axis_idx++){
                    resultCoordinateComputation[i][j][1][axis_idx] <== equal[i][j].out * getSecondDummy.out[1][axis_idx];
                }
            }
            if (j != 0) {
                for (var axis_idx = 0; axis_idx < k; axis_idx++){
                    resultCoordinateComputation[i][j][0][axis_idx] <== equal[i][j].out * powers[i][j][0][axis_idx];
                }
                for (var axis_idx = 0; axis_idx < k; axis_idx++){
                    resultCoordinateComputation[i][j][1][axis_idx] <== equal[i][j].out * powers[i][j][1][axis_idx];
                }
            }
        }
    }
    
    component getSumOfNElements[parts][2][k];
    for (var i = 0; i < parts; i++){
        for (var j = 0; j < 2; j++){
            for (var axis_idx = 0; axis_idx < k; axis_idx++){
                getSumOfNElements[i][j][axis_idx] = GetSumOfNElements(2 ** STRIDE);
                for (var stride_idx = 0; stride_idx < 2 ** STRIDE; stride_idx++){
                    getSumOfNElements[i][j][axis_idx].in[stride_idx] <== resultCoordinateComputation[i][stride_idx][j][axis_idx];
                }
            }
        }
    }
    
    signal additionPoints[parts][2][k];
    for (var part_idx = 0; part_idx < parts; part_idx++){
        for (var i = 0; i < 2; i++){
            for (var j = 0; j < k; j++){
                additionPoints[part_idx][i][j] <== getSumOfNElements[part_idx][i][j].out;
            }
        }
    }
    
    component adders[parts - 1];

    component isFirstDummyLeft[parts - 1];
    component isSecondDummyLeft[parts - 1];
    
    component isFirstDummyRight[parts - 1];
    component isSecondDummyRight[parts - 1];
    
    
    signal resultingPointsLeft[parts][2][k];
    signal resultingPointsLeft2[parts][2][k];
    signal resultingPointsRight[parts][2][k];
    signal resultingPointsRight2[parts][2][k];
    signal resultingPoints[parts][2][k];
    
    component switcherLeft[parts][2][k];
    component switcherRight[parts][2][k];
    
    
    for (var i = 0; i < parts - 1; i++){
        adders[i] = EllipticCurveAdd( A, B, P);

        isFirstDummyLeft[i] = IsEqual();
        isFirstDummyLeft[i].in[0] <== getDummy.dummyPoint[0][0];
        isSecondDummyLeft[i] = IsEqual();
        isSecondDummyLeft[i].in[0] <== getSecondDummy.out[0][0];

        isFirstDummyRight[i] = IsEqual();
        isFirstDummyRight[i].in[0] <== getDummy.dummyPoint[0][0];
        isSecondDummyRight[i] = IsEqual();
        isSecondDummyRight[i].in[0] <== getSecondDummy.out[0][0];

        
        
        if (i == 0){
            isFirstDummyLeft[i].in[1] <== additionPoints[i][0][0];
            isSecondDummyLeft[i].in[1] <== additionPoints[i][0][0];
            isFirstDummyRight[i].in[1] <== additionPoints[i + 1][0][0];
            isSecondDummyRight[i].in[1] <== additionPoints[i + 1][0][0];
            adders[i].in1 <== additionPoints[i];
            adders[i].in2 <== additionPoints[i + 1];
               
            // 0 0 -> adders
            // 0 1 -> left
            // 1 0 -> right
            // 1 1 -> right
            for (var axis_idx = 0; axis_idx < 2; axis_idx++){
                for (var j = 0; j < k; j++){
                    
                    switcherRight[i][axis_idx][j] = Switcher();
                    switcherRight[i][axis_idx][j].bool <== isSecondDummyRight[i].out + isFirstDummyRight[i].out;
                    switcherRight[i][axis_idx][j].in[0] <== adders[i].out[axis_idx][j];
                    switcherRight[i][axis_idx][j].in[1] <== additionPoints[i][axis_idx][j];
                    
                    switcherLeft[i][axis_idx][j] = Switcher();
                    switcherLeft[i][axis_idx][j].bool <== isSecondDummyLeft[i].out + isFirstDummyLeft[i].out;
                    switcherLeft[i][axis_idx][j].in[0] <== additionPoints[i + 1][axis_idx][j];
                    switcherLeft[i][axis_idx][j].in[1] <== switcherRight[i][axis_idx][j].out[0];
                    
                    resultingPoints[i][axis_idx][j] <== switcherLeft[i][axis_idx][j].out[1];
                }
            }
            
        } else {
            isFirstDummyLeft[i].in[1] <== resultingPoints[i - 1][0][0];
            isSecondDummyLeft[i].in[1] <== resultingPoints[i - 1][0][0];
            isFirstDummyRight[i].in[1] <== additionPoints[i + 1][0][0];
            isSecondDummyRight[i].in[1] <== additionPoints[i + 1][0][0];

            adders[i].in1 <== resultingPoints[i - 1];
            adders[i].in2 <== additionPoints[i + 1];
            
            // 0 0 -> adders
            // 0 1 -> left
            // 1 0 -> right
            // 1 1 -> right
            for (var axis_idx = 0; axis_idx < 2; axis_idx++){
                for (var j = 0; j < k; j++){
                    
                    switcherRight[i][axis_idx][j] = Switcher();
                    switcherRight[i][axis_idx][j].bool <== isSecondDummyRight[i].out + isFirstDummyRight[i].out;
                    switcherRight[i][axis_idx][j].in[0] <== adders[i].out[axis_idx][j];
                    switcherRight[i][axis_idx][j].in[1] <== resultingPoints[i - 1][axis_idx][j];
                    
                    switcherLeft[i][axis_idx][j] = Switcher();
                    switcherLeft[i][axis_idx][j].bool <== isSecondDummyLeft[i].out + isFirstDummyLeft[i].out;
                    switcherLeft[i][axis_idx][j].in[0] <== additionPoints[i + 1][axis_idx][j];
                    switcherLeft[i][axis_idx][j].in[1] <== switcherRight[i][axis_idx][j].out[0];
                    
                    resultingPoints[i][axis_idx][j] <== switcherLeft[i][axis_idx][j].out[1];
                }
            }
        }
    }
    out <== resultingPoints[parts - 2];
    
}