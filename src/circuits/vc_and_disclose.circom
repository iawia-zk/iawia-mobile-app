pragma circom 2.1.9;

include "circomlib/circuits/poseidon.circom";
include "../passport/disclose/disclose.circom";
include "../passport/date/isValid.circom";

//TODO

/// @title VC_AND_DISCLOSE
/// @notice Verify user's commitment is part of the merkle tree and optionally disclose data from DG1
/// @param nLevels Maximum number of levels in the merkle tree
/// @param MAX_FORBIDDEN_COUNTRIES_LIST_LENGTH Maximum number of countries present in the forbidden countries list
/// @input secret Secret of the user — used to reconstruct commitment and generate nullifier
/// @input attestation_id Attestation ID of the credential used to generate the commitment
/// @input dg1 Data group 1 of the passport
/// @input eContent_shaBytes_packed_hash Hash of the eContent packed
/// @input dsc_tree_leaf Leaf of the DSC tree, to keep a record of the full CSCA and DSC that were used
/// @input merkle_root Root of the commitment merkle tree
/// @input leaf_depth Actual size of the merkle tree
/// @input path Path of the commitment in the merkle tree
/// @input siblings Siblings of the commitment in the merkle tree
/// @input selector_dg1 bitmap used which bytes from the dg1 are revealed
/// @input majority Majority user wants to prove he is older than: YY — ASCII
/// @input current_date Current date: YYMMDD — number
/// @input selector_older_than bitmap used to reveal the majority
/// @input forbidden_countries_list Forbidden countries list user wants to prove he is not from
/// @input smt_leaf_key value of the leaf of the smt corresponding to his path
/// @input smt_root root of the smt
/// @input smt_siblings siblings of the smt
/// @input selector_ofac bitmap used to reveal the OFAC verification result
/// @input scope Scope of the application users generates the proof for
/// @input user_identifier User identifier — address or UUID
/// @output revealedData_packed Packed revealed data
/// @output forbidden_countries_list_packed Packed forbidden countries list
/// @output nullifier Scope nullifier - not deterministic on the passport data
template VC_AND_DISCLOSE() {
    signal input secret;
    signal input attestation_id;
    signal input dg1[93];
    signal input eContent_shaBytes_packed_hash;
    signal input dsc_tree_leaf;

    signal input selector_dg1[88];

    signal input majority[2];
    signal input current_date[6];
    signal input selector_older_than;


    signal input scope;
    signal input user_identifier;

    // verify commitment is part of the merkle tree

    // verify passport validity
    signal validity_ASCII[6];
    for (var i = 0; i < 6; i++) {
        validity_ASCII[i] <== dg1[70 +i];
    }
    
    IsValid()(current_date,validity_ASCII);
    
    // disclose optional data
    component disclose = DISCLOSE();
    disclose.dg1 <== dg1;
    disclose.selector_dg1 <== selector_dg1;
    disclose.selector_older_than <== selector_older_than;
    disclose.current_date <== current_date;
    disclose.majority <== majority;

    signal output revealedData_packed[3] <== disclose.revealedData_packed;


    signal output nullifier <== Poseidon(2)([secret, scope]);
}

component main {
    public [
        scope,
        user_identifier,
        current_date,
        attestation_id
    ]
} = VC_AND_DISCLOSE();
