#!/bin/bash

source "scripts/build/common.sh"

# Circuit-specific configurations
CIRCUIT_TYPE="dsc"
OUTPUT_DIR="build/${CIRCUIT_TYPE}"

# Define circuits and their configurations
# format: name:poweroftau:build_flag
CIRCUITS=(
    # ECDSA circuits
    "main_component:21:true"
)

build_circuits "$CIRCUIT_TYPE" "$OUTPUT_DIR" "${CIRCUITS[@]}" 
