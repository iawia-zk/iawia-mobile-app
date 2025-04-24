pragma circom 2.1.9;


template Switcher() {
    signal input bool;
    signal input in[2];
    signal output out[2];
    
    signal aux;
    
    aux <== (in[1] - in[0]) * bool; 
    out[0] <== aux + in[0];
    out[1] <==  -aux + in[1];
}