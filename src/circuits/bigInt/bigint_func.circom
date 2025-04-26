pragma circom 2.1.9;

function isNegative(x) {
    // half babyjubjub field size
    return x > 10944121435919637611123202872628637544274182200208017171849102093287904247808 ? 1 : 0;
}

function SplitFn(in, n, m) {
    return [in % (1 << n), (in \ (1 << n)) % (1 << m)];
}

function SplitThreeFn(in, n, m, k) {
    return [in % (1 << n), (in \ (1 << n)) % (1 << m), (in \ (1 << n + m)) % (1 << k)];
}

// in is an m bit number
// split into ceil(m/n) n-bit registers
function splitOverflowedRegister(m, n, in) {
    var out[100];

    for (var i = 0; i < 100; i++) {
        out[i] = 0;
    }

    var nRegisters = div_ceil(m, n);
    var running = in;
    for (var i = 0; i < nRegisters; i++) {
        out[i] = running % (1<<n);
        running>>=n;
    }

    return out;
}

// n bits per register
// a and b both have k registers
// out[0] has length 2 * k
// adapted from BigMulShortLong and LongToShortNoEndCarry2 witness computation
function prod(n, k, a, b) {
    // first compute the intermediate values. taken from BigMulShortLong
    var prod_val[100]; // length is 2 * k - 1
    for (var i = 0; i < 2 * k - 1; i++) {
        prod_val[i] = 0;
        if (i < k) {
            for (var a_idx = 0; a_idx <= i; a_idx++) {
                prod_val[i] = prod_val[i] + a[a_idx] * b[i - a_idx];
            }
        } else {
            for (var a_idx = i - k + 1; a_idx < k; a_idx++) {
                prod_val[i] = prod_val[i] + a[a_idx] * b[i - a_idx];
            }
        }
    }

    // now do a bunch of carrying to make sure registers not overflowed. taken from LongToShortNoEndCarry2
    var out[100]; // length is 2 * k

    var split[100][3]; // first dimension has length 2 * k - 1
    for (var i = 0; i < 2 * k - 1; i++) {
        split[i] = SplitThreeFn(prod_val[i], n, n, n);
    }

    var carry[100]; // length is 2 * k - 1
    carry[0] = 0;
    out[0] = split[0][0];
    if (2 * k - 1 > 1) {
        var sumAndCarry[2] = SplitFn(split[0][1] + split[1][0], n, n);
        out[1] = sumAndCarry[0];
        carry[1] = sumAndCarry[1];
    }
    if (2 * k - 1 > 2) {
        for (var i = 2; i < 2 * k - 1; i++) {
            var sumAndCarry[2] = SplitFn(split[i][0] + split[i-1][1] + split[i-2][2] + carry[i-1], n, n);
            out[i] = sumAndCarry[0];
            carry[i] = sumAndCarry[1];
        }
        out[2 * k - 1] = split[2*k-2][1] + split[2*k-3][2] + carry[2*k-2];
    }
    return out;
}

// n bits per register
// a has k registers
// p has k registers
// e has k registers
// k * n <= 500
// p is a prime
// computes a^e mod p
function mod_exp(n, k, a, p, e) {
    var eBits[500]; // length is k * n
    for (var i = 0; i < k; i++) {
        for (var j = 0; j < n; j++) {
            eBits[j + n * i] = (e[i] >> j) & 1;
        }
    }

    var out[100]; // length is k
    for (var i = 0; i < 100; i++) {
        out[i] = 0;
    }
    out[0] = 1;

    // repeated squaring
    for (var i = k * n - 1; i >= 0; i--) {
        // multiply by a if bit is 0
        if (eBits[i] == 1) {
            var temp[200]; // length 2 * k
            temp = prod(n, k, out, a);
            var temp2[2][100];
            temp2 = long_div(n, k, k, temp, p);
            out = temp2[1];
        }

        // square, unless we're at the end
        if (i > 0) {
            var temp[200]; // length 2 * k
            temp = prod(n, k, out, out);
            var temp2[2][100];
            temp2 = long_div(n, k, k, temp, p);
            out = temp2[1];
        }

    }
    return out;
}

// n bits per register
// a has k registers
// p has k registers
// k * n <= 500
// p is a prime
// if a == 0 mod p, returns 0
// else computes inv = a^(p-2) mod p
function mod_inv(n, k, a, p) {
    var isZero = 1;
    for (var i = 0; i < k; i++) {
        if (a[i] != 0) {
            isZero = 0;
        }
    }
    if (isZero == 1) {
        var ret[100];
        for (var i = 0; i < k; i++) {
            ret[i] = 0;
        }
        return ret;
    }

    var pCopy[100];
    for (var i = 0; i < 100; i++) {
        if (i < k) {
            pCopy[i] = p[i];
        } else {
            pCopy[i] = 0;
        }
    }

    var two[100];
    for (var i = 0; i < 100; i++) {
        two[i] = 0;
    }
    two[0] = 2;

    var pMinusTwo[100];
    pMinusTwo = long_sub(n, k, pCopy, two); // length k
    var out[100];
    out = mod_exp(n, k, a, pCopy, pMinusTwo);
    return out;
}

// a, b and out are all n bits k registers
function long_sub_mod_p(n, k, a, b, p){
    var gt = long_gt(n, k, a, b);
    var tmp[100];
    if(gt){
        tmp = long_sub(n, k, a, b);
    }
    else{
        tmp = long_sub(n, k, b, a);
    }
    var out[2][100];
    for(var i = k;i < 2 * k; i++){
        tmp[i] = 0;
    }
    out = long_div(n, k, k, tmp, p);
    if(gt==0){
        tmp = long_sub(n, k, p, out[1]);
    }
    return tmp;
}

// a, b, p and out are all n bits k registers
function prod_mod_p(n, k, a, b, p){
    var tmp[100];
    var result[2][100];
    tmp = prod(n, k, a, b);
    result = long_div(n, k, k, tmp, p);
    return result[1];
}
