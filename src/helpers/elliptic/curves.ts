export interface StandardCurve {
  name: string;
  p: string;
  a: string;
  b: string;
  G: string;
  n: string;
  h: string;
}

export const standardCurves: StandardCurve[] = [
  {
    name: 'secp521r1',
    p: '01FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
    a: '01FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFC',
    b: '0051953EB9618E1C9A1F929A21A0B68540EEA2DA725B99B315F3B8B489918EF109E156193951EC7E937B1652C0BD3BB1BF073573DF883D2C34F1EF451FD46B503F00',
    G: '0400C6858E06B70404E9CD9E3ECB662395B4429C648139053FB521F828AF606B4D3DBAA14B5E77EFE75928FE1DC127A2FFA8DE3348B3C1856A429BF97E7E31C2E5BD66011839296A789A3BC0045C8A5FB42C7D1BD998F54449579B446817AFBD17273E662C97EE72995EF42640C550B9013FAD0761353C7086A272C24088BE94769FD16650',
    n: '01FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFA51868783BF2F966B7FCC0148F709A5D03BB5C9B8899C47AEBB6FB71E91386409',
    h: '01',
  },
];

export function normalizeHex(hex: string): string {
  return hex.toLowerCase().replace(/^0x/, '').replace(/^00/, '');
}

export function identifyCurve(params: any): string {
  const normalizedParams = {
    p: normalizeHex(params.p),
    a: normalizeHex(params.a),
    b: normalizeHex(params.b),
    G: normalizeHex(params.G),
    n: normalizeHex(params.n),
    h: normalizeHex(params.h),
  };

  for (const curve of standardCurves) {
    if (
      normalizedParams.p === normalizeHex(curve.p) &&
      normalizedParams.a === normalizeHex(curve.a) &&
      normalizedParams.b === normalizeHex(curve.b) &&
      normalizedParams.G === normalizeHex(curve.G) &&
      normalizedParams.n === normalizeHex(curve.n) &&
      normalizedParams.h === normalizeHex(curve.h)
    ) {
      return curve.name;
    }
  }
  console.log('Unknown curve:', normalizedParams);
  return 'Unknown curve';
}

export function getECDSACurveBits(curveName: string): string {
  if (curveName === 'secp521r1') {
    return '521';
  }
  console.warn('\x1b[31m%s\x1b[0m', `curve name ${curveName} not found in curveBits`);
  return 'unknown';
}

export function getCurveForElliptic(curveName: string): string {
  if (curveName === 'secp521r1') {
    return 'p521';
  }
  console.warn('Curve not supported for elliptic library:', curveName);
  return 'unknown';
}
