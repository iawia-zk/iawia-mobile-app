pragma circom 2.1.9;

include "@zk-email/circuits/utils/bytes.circom";
include "../date/isOlderThan.circom";
include "./proveCountryIsNotInList.circom";

/// @notice Disclosure circuit — used after user registration
/// @param MAX_FORBIDDEN_COUNTRIES_LIST_LENGTH Maximum number of countries present in the forbidden countries list
/// @input dg1 Data group 1 of the passport
/// @input selector_dg1 bitmap used which bytes from the dg1 are revealed
/// @input majority Majority user wants to prove he is older than: YY — ASCII
/// @input current_date Current date: YYMMDD — number
/// @input selector_older_than bitmap used to reveal the majority
/// @input forbidden_countries_list Forbidden countries list user wants to prove he is not from
/// @input smt_leaf_key value of the leaf of the smt corresponding to his path
/// @input smt_root root of the smt
/// @input smt_siblings siblings of the smt
/// @input selector_ofac bitmap used to reveal the OFAC verification result
/// @output revealedData_packed Packed revealed data
/// @output forbidden_countries_list_packed Packed forbidden countries list
template DISCLOSE(MAX_FORBIDDEN_COUNTRIES_LIST_LENGTH) {

    signal input dg1[93];
    signal input selector_dg1[88];

    signal input majority[2];
    signal input current_date[6];
    signal input selector_older_than;

    signal input forbidden_countries_list[MAX_FORBIDDEN_COUNTRIES_LIST_LENGTH * 3];

    // assert selectors are 0 or 1
    for (var i = 0; i < 88; i++) {
        selector_dg1[i] * (selector_dg1[i] - 1) === 0;
    }

    selector_older_than * (selector_older_than - 1) === 0;

    // Older than
    component isOlderThan = IsOlderThan();
    isOlderThan.majorityASCII <== majority;
    for (var i = 0; i < 6; i++) {
        isOlderThan.currDate[i] <== current_date[i];
        isOlderThan.birthDateASCII[i] <== dg1[62 + i];
    }

    signal older_than_verified[2];
    older_than_verified[0] <== isOlderThan.out * majority[0];
    older_than_verified[1] <== isOlderThan.out * majority[1];

    signal revealedData[90]; // mrz: 88 bytes | older_than: 2 bytes
    for (var i = 0; i < 88; i++) {
        revealedData[i] <== dg1[5+i] * selector_dg1[i];
    }

    revealedData[88] <== older_than_verified[0] * selector_older_than;
    revealedData[89] <== older_than_verified[1] * selector_older_than;

    signal output revealedData_packed[3] <== PackBytes(90)(revealedData);

    var chunkLength = computeIntChunkLength(MAX_FORBIDDEN_COUNTRIES_LIST_LENGTH * 3);
    signal output forbidden_countries_list_packed[chunkLength] <== ProveCountryIsNotInList(MAX_FORBIDDEN_COUNTRIES_LIST_LENGTH)(dg1, forbidden_countries_list);
}
