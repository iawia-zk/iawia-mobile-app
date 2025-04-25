pragma circom 2.1.9;

include "circomlib/circuits/comparators.circom";
include "constants.circom";
include "signatureAlgorithm.circom";

template CheckPubkeyPosition(prefixLength, maxPubkeyLength, suffixLength) {
    signal input pubkey_with_prefix_and_suffix[prefixLength + maxPubkeyLength + suffixLength];
    signal input pubkey_actual_length;

    var kLengthFactor = 2;
    var NUM_VALID_PREFIXES = 13;

    // Grab the prefix
    signal prefix_bytes[prefixLength];
    for (var i = 0; i < prefixLength; i++) {
        prefix_bytes[i] <== pubkey_with_prefix_and_suffix[i];
    }

    // Check for each valid prefix if it matches
    var validPrefixes[NUM_VALID_PREFIXES][prefixLength] = getValidECDSAPrefixes();
    signal candidateMatches[NUM_VALID_PREFIXES];
    signal byteMatches[NUM_VALID_PREFIXES][prefixLength];
    signal sum[NUM_VALID_PREFIXES][prefixLength+1];
    component cmp[NUM_VALID_PREFIXES][prefixLength];
    component eq[NUM_VALID_PREFIXES];

    for (var j = 0; j < NUM_VALID_PREFIXES; j++) {
        sum[j][0] <== 0;
        for (var i = 0; i < prefixLength; i++) {
            cmp[j][i] = IsEqual();
            cmp[j][i].in[0] <== prefix_bytes[i];
            cmp[j][i].in[1] <== validPrefixes[j][i];
            byteMatches[j][i] <== cmp[j][i].out;
            sum[j][i+1] <== sum[j][i] + byteMatches[j][i];
        }
        eq[j] = IsEqual();
        eq[j].in[0] <== sum[j][prefixLength];
        eq[j].in[1] <== prefixLength;
        candidateMatches[j] <== eq[j].out;
    }

    // Get the key length for each valid prefix
    var keyLengths[NUM_VALID_PREFIXES] = prefixIndexToECDSAKeyLength();

    // Running sum of the candidate matches
    signal prefix_sums[NUM_VALID_PREFIXES + 1];
    signal key_length_sums[NUM_VALID_PREFIXES + 1];
    prefix_sums[0] <== 0;
    key_length_sums[0] <== 0;
    for (var i = 0; i < NUM_VALID_PREFIXES; i++) {
        prefix_sums[i + 1] <== prefix_sums[i] + candidateMatches[i];
        key_length_sums[i + 1] <== key_length_sums[i] + keyLengths[i] * candidateMatches[i];
    }

    // Check that one of the prefixes matched
    signal one_prefix_matched <== IsEqual()([prefix_sums[NUM_VALID_PREFIXES], 1]);
    one_prefix_matched === 1;

    // Check the actual key length given matches the one from the prefix
    signal key_length_ok <== IsEqual()([
        key_length_sums[NUM_VALID_PREFIXES] * kLengthFactor / 8,
        pubkey_actual_length
    ]);
    key_length_ok === 1;

    
    // If using ECDSA, check pubkey_actual_length is the key length (ECDSA circuits always support only one key size)
    var minKeyLength = 528;
    signal isCorrectLength <== IsEqual()([
        pubkey_actual_length,
        minKeyLength * kLengthFactor / 8
    ]);
    isCorrectLength === 1;
    
}
