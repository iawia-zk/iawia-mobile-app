pragma circom 2.1.9;

function getValidECDSAPrefixes() {
    var prefixes[13][33];

    // 224-bit key 
    prefixes[0] = [0x34, 0xaa, 0x26, 0x43, 0x66, 0x86, 0x2a, 0x18, 0x30, 0x25, 0x75, 0xd0, 0xfb, 0x98, 0xd1, 0x16, 0xbc, 0x4b, 0x6d, 0xde, 0xbc, 0xa3, 0xa5, 0xa7, 0x93, 0x9f, 0x02, 0x01, 0x01, 0x03, 0x3a, 0x00, 0x04];
    // 224-bit key 
    prefixes[1] = [0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x16, 0xa2, 0xe0, 0xb8, 0xf0, 0x3e, 0x13, 0xdd, 0x29, 0x45, 0x5c, 0x5c, 0x2a, 0x3d, 0x02, 0x01, 0x01, 0x03, 0x3a, 0x00, 0x04];
    // 256-bit key 
    prefixes[2] = [0xa9, 0xbc, 0x3e, 0x66, 0x0a, 0x90, 0x9d, 0x83, 0x8d, 0x71, 0x8c, 0x39, 0x7a, 0xa3, 0xb5, 0x61, 0xa6, 0xf7, 0x90, 0x1e, 0x0e, 0x82, 0x97, 0x48, 0x56, 0xa7, 0x02, 0x01, 0x01, 0x03, 0x42, 0x00, 0x04];
    // 256-bit key 
    prefixes[3] = [0x00, 0x00, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xbc, 0xe6, 0xfa, 0xad, 0xa7, 0x17, 0x9e, 0x84, 0xf3, 0xb9, 0xca, 0xc2, 0xfc, 0x63, 0x25, 0x51, 0x02, 0x01, 0x01, 0x03, 0x42, 0x00, 0x04];
    // 256-bit key 
    prefixes[4] = [0xdb, 0xa1, 0xee, 0xa9, 0xbc, 0x3e, 0x66, 0x0a, 0x90, 0x9d, 0x83, 0x8d, 0x71, 0x8c, 0x39, 0x7a, 0xa3, 0xb5, 0x61, 0xa6, 0xf7, 0x90, 0x1e, 0x0e, 0x82, 0x97, 0x48, 0x56, 0xa7, 0x03, 0x42, 0x00, 0x04];
    // 256-bit key 
    prefixes[5] = [0x06, 0x13, 0x02, 0x4e, 0x4c, 0x30, 0x5a, 0x30, 0x14, 0x06, 0x07, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x02, 0x01, 0x06, 0x09, 0x2b, 0x24, 0x03, 0x03, 0x02, 0x08, 0x01, 0x01, 0x07, 0x03, 0x42, 0x00, 0x04];
    // 384-bit key 
    prefixes[6] = [0x56, 0xb3, 0x1f, 0x16, 0x6e, 0x6c, 0xac, 0x04, 0x25, 0xa7, 0xcf, 0x3a, 0xb6, 0xaf, 0x6b, 0x7f, 0xc3, 0x10, 0x3b, 0x88, 0x32, 0x02, 0xe9, 0x04, 0x65, 0x65, 0x02, 0x01, 0x01, 0x03, 0x62, 0x00, 0x04];
    // 384-bit key 
    prefixes[7] = [0xff, 0xff, 0xc7, 0x63, 0x4d, 0x81, 0xf4, 0x37, 0x2d, 0xdf, 0x58, 0x1a, 0x0d, 0xb2, 0x48, 0xb0, 0xa7, 0x7a, 0xec, 0xec, 0x19, 0x6a, 0xcc, 0xc5, 0x29, 0x73, 0x02, 0x01, 0x01, 0x03, 0x62, 0x00, 0x04];
    // 384-bit key 
    prefixes[8] = [0x41, 0x2d, 0x41, 0x4c, 0x47, 0x45, 0x52, 0x49, 0x41, 0x30, 0x76, 0x30, 0x10, 0x06, 0x07, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x02, 0x01, 0x06, 0x05, 0x2b, 0x81, 0x04, 0x00, 0x22, 0x03, 0x62, 0x00, 0x04];
    // 384-bit key 
    prefixes[9] = [0x55, 0x04, 0x0b, 0x0c, 0x04, 0x50, 0x49, 0x42, 0x41, 0x30, 0x76, 0x30, 0x10, 0x06, 0x07, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x02, 0x01, 0x06, 0x05, 0x2b, 0x81, 0x04, 0x00, 0x22, 0x03, 0x62, 0x00, 0x04];
    // 512-bit key 
    prefixes[10] = [0x19, 0x41, 0x86, 0x61, 0x19, 0x7f, 0xac, 0x10, 0x47, 0x1d, 0xb1, 0xd3, 0x81, 0x08, 0x5d, 0xda, 0xdd, 0xb5, 0x87, 0x96, 0x82, 0x9c, 0xa9, 0x00, 0x69, 0x02, 0x01, 0x01, 0x03, 0x81, 0x82, 0x00, 0x04];
    // 521-bit key 
    prefixes[11] = [0x6b, 0x7f, 0xcc, 0x01, 0x48, 0xf7, 0x09, 0xa5, 0xd0, 0x3b, 0xb5, 0xc9, 0xb8, 0x89, 0x9c, 0x47, 0xae, 0xbb, 0x6f, 0xb7, 0x1e, 0x91, 0x38, 0x64, 0x09, 0x02, 0x01, 0x01, 0x03, 0x81, 0x86, 0x00, 0x04];
    // 521-bit key 
    prefixes[12] = [0x20, 0x54, 0x75, 0x72, 0x6b, 0x65, 0x79, 0x30, 0x81, 0x9b, 0x30, 0x10, 0x06, 0x07, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x02, 0x01, 0x06, 0x05, 0x2b, 0x81, 0x04, 0x00, 0x23, 0x03, 0x81, 0x86, 0x00, 0x04];

    return prefixes;
}

function prefixIndexToECDSAKeyLength() {
    var keyLengths[13] = [224, 224, 256, 256, 256, 256, 384, 384, 384, 384, 512, 528, 528];
    return keyLengths;
}