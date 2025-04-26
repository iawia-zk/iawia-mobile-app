#!/bin/bash

# run from root
# first argument should register | dsc | disclose
if [[  $1 != "register" && $1 != "dsc" && $1 != "disclose" ]]; then
    echo "first argument should be register | dsc | disclose"
    exit 1
fi

# REGISTER_CIRCUITS=(
#     "register_sha512_sha512_sha512_ecdsa_secp521r1:true"
# )

DISCLOSE_CIRCUITS=(
    "vc_and_disclose:true"
)

DSC_CIRCUITS=(
    "main_component:true"
)

# if [[ $1 == "register" ]]; then
#     allowed_circuits=("${REGISTER_CIRCUITS[@]}")
#     output="output/register"
#     mkdir -p $output
#     basepath="./circuits/circuits/register/instances"
if [[ $1 == "dsc" ]]; then
    allowed_circuits=("${DSC_CIRCUITS[@]}")
    output="output/dsc"
    mkdir -p $output
    basepath="./dsc"
elif [[ $1 == "disclose" ]]; then
    allowed_circuits=("${DISCLOSE_CIRCUITS[@]}")
    output="output/disclose"
    mkdir -p $output
    basepath="."
fi

pids=() 
for item in "${allowed_circuits[@]}"; do
    filename=$(echo "$item" | cut -d':' -f1)
    allowed=$(echo "$item" | cut -d':' -f2)

    if [[ $allowed == 'false' ]]; then
        echo "Skipping $filename (not in allowed circuits)"
        continue
    fi

    while [[ ${#pids[@]} -ge 5 ]]; do
        new_pids=() 
        for pid in "${pids[@]}"; do
            if kill -0 "$pid" 2>/dev/null; then
                new_pids+=("$pid")
            else
                echo "Process $pid finished"
            fi
        done
        pids=("${new_pids[@]}")
        sleep 1
    done

    echo $filename $allowed
    filepath=${basepath}/${filename}.circom
    circom_pid=$!
    circuit_name="${filename%.*}"
    (
        circom $filepath \
        -l "./node_modules" \
        -l "./node_modules/circomlib/circuits" \
        --O1 -c --output $output && \
        cd $output/${circuit_name}_cpp && \
        make 
    ) & 
    pids+=($!)
done

echo "Waiting for all circuits to compile..."
wait "${pids[@]}"
echo "All circuits compiled successfully!"
