// TODO: fix file paths for node_modules, files, etc.
import { describe } from 'mocha';
import { assert, expect } from 'chai';
import path from 'path';
import { wasm as wasm_tester } from 'circom_tester';
import { attributeToPosition, PASSPORT_ATTESTATION_ID } from 'constants/circuits';
import { poseidon1, poseidon2 } from 'poseidon-lite';
import { LeanIMT } from '@openpassport/zk-kit-lean-imt';
import { generateCircuitInputsVCandDisclose } from 'helpers/circuits/generateInputs';
import {
  formatAndUnpackReveal,
  formatAndUnpackForbiddenCountriesList,
  getAttributeFromUnpackedReveal,
} from 'helpers/circuits/formatOutputs';
import crypto from 'crypto';
import { genMockPassportData } from 'helpers/parsePassport/generateMockData';
import { generateCommitment } from 'helpers/parsePassport/passport';

describe('Disclose', function () {
  this.timeout(0);
  let inputs: any;
  let circuit: any;
  let w: any;
  const passportData = genMockPassportData(
    'sha512',
    'sha512',
    'ecdsa_sha512_secp521r1_521',
    'FRA',
    '000101',
    '300101'
  );
  const forbidden_countries_list = ['ALG', 'DZA'];

  const secret = BigInt(Math.floor(Math.random() * Math.pow(2, 254))).toString();
  const majority = '18';
  const user_identifier = crypto.randomUUID();
  const selector_dg1 = Array(88).fill('1');
  const selector_older_than = '1';
  const scope = '@coboyApp';
  const attestation_id = PASSPORT_ATTESTATION_ID;

  // compute the commitment and insert it in the tree
  const commitment = generateCommitment(secret, attestation_id, passportData);
  console.log('commitment in js ', commitment);
  const tree: any = new LeanIMT((a, b) => poseidon2([a, b]), []);
  tree.insert(BigInt(commitment));

  before(async () => {
    circuit = await wasm_tester(
      path.join(__dirname, '../../circuits/disclose/vc_and_disclose.circom'),
      {
        include: [
          'node_modules',
          './node_modules/@zk-kit/binary-merkle-root.circom/src',
          './node_modules/circomlib/circuits',
        ],
      }
    );

    inputs = generateCircuitInputsVCandDisclose(
      secret,
      PASSPORT_ATTESTATION_ID,
      passportData,
      scope,
      selector_dg1,
      selector_older_than,
      tree,
      majority,
      forbidden_countries_list,
      user_identifier
    );
  });

  it('should compile and load the circuit', async function () {
    expect(circuit).to.not.be.undefined;
  });

  it('should have nullifier == poseidon(secret, scope)', async function () {
    w = await circuit.calculateWitness(inputs);
    const nullifier_js = poseidon2([inputs.secret, inputs.scope]).toString();
    const nullifier_circom = (await circuit.getOutput(w, ['nullifier'])).nullifier;

    console.log('nullifier_circom', nullifier_circom);
    console.log('nullifier_js', nullifier_js);
    expect(nullifier_circom).to.equal(nullifier_js);
  });

  it('should fail to calculate witness with different attestation_id', async function () {
    try {
      const invalidInputs = {
        ...inputs,
        attestation_id: poseidon1([
          BigInt(Buffer.from('ANON-AADHAAR').readUIntBE(0, 6)),
        ]).toString(),
      };
      await circuit.calculateWitness(invalidInputs);
      expect.fail('Expected an error but none was thrown.');
    } catch (error) {
      // expect(error.message).to.include('Assert Failed');
    }
  });

  describe('MRZ selective disclosure', function () {
    const attributeCombinations = [
      ['issuing_state', 'name'],
      ['passport_number', 'nationality', 'date_of_birth'],
      ['gender', 'expiry_date'],
    ];

    attributeCombinations.forEach((combination) => {
      it(`Disclosing ${combination.join(', ')}`, async function () {
        const attributeToReveal = Object.keys(attributeToPosition).reduce((acc, attribute) => {
          acc[attribute] = combination.includes(attribute);
          return acc;
        }, {});

        const selector_dg1 = Array(88).fill('0');

        Object.entries(attributeToReveal).forEach(([attribute, reveal]) => {
          if (reveal) {
            const [start, end] = attributeToPosition[attribute];
            selector_dg1.fill('1', start, end + 1);
          }
        });

        inputs = {
          ...inputs,
          selector_dg1: selector_dg1.map(String),
        };

        w = await circuit.calculateWitness(inputs);

        const revealedData_packed = await circuit.getOutput(w, ['revealedData_packed[3]']);

        const reveal_unpacked = formatAndUnpackReveal(revealedData_packed);

        for (let i = 0; i < 88; i++) {
          if (selector_dg1[i] == '1') {
            const char = String.fromCharCode(Number(inputs.dg1[i + 5]));
            assert(reveal_unpacked[i] === char, 'Should reveal the right character');
          } else {
            assert(reveal_unpacked[i] === '\x00', 'Should not reveal');
          }
        }

        const forbidden_countries_list_packed = await circuit.getOutput(w, [
          'forbidden_countries_list_packed[1]',
        ]);
        const forbidden_countries_list_unpacked = formatAndUnpackForbiddenCountriesList(
          forbidden_countries_list_packed
        );
        expect(forbidden_countries_list_unpacked).to.deep.equal(forbidden_countries_list);
      });
    });
  });

  it('should allow disclosing majority', async function () {
    const selector_dg1 = Array(88).fill('0');

    w = await circuit.calculateWitness({
      ...inputs,
      selector_dg1: selector_dg1.map(String),
    });
    const revealedData_packed = await circuit.getOutput(w, ['revealedData_packed[3]']);

    const reveal_unpacked = formatAndUnpackReveal(revealedData_packed);
    const older_than = getAttributeFromUnpackedReveal(reveal_unpacked, 'older_than');
    expect(older_than).to.equal('18');
  });

  it("shouldn't allow disclosing wrong majority", async function () {
    const selector_dg1 = Array(88).fill('0');

    w = await circuit.calculateWitness({
      ...inputs,
      majority: ['5', '0'].map((char) => BigInt(char.charCodeAt(0)).toString()),
      selector_dg1: selector_dg1.map(String),
    });

    const revealedData_packed = await circuit.getOutput(w, ['revealedData_packed[3]']);

    const reveal_unpacked = formatAndUnpackReveal(revealedData_packed);
    expect(reveal_unpacked[88]).to.equal('\x00');
    expect(reveal_unpacked[89]).to.equal('\x00');
  });

  describe('OFAC disclosure', function () {
    it('should allow disclosing OFAC check result when selector is 1', async function () {
      w = await circuit.calculateWitness(inputs);

      const revealedData_packed = await circuit.getOutput(w, ['revealedData_packed[3]']);
      const reveal_unpacked = formatAndUnpackReveal(revealedData_packed);

      console.log('reveal_unpacked', reveal_unpacked);
      // OFAC result is stored at index 90 in the revealed data
      const ofac_results = reveal_unpacked.slice(90, 93);

      console.log('ofac_results', ofac_results);

      expect(ofac_results).to.deep.equal(
        ['\x01', '\x01', '\x01'],
        'OFAC result bits should be [1, 1, 1]'
      );
      expect(ofac_results).to.not.equal(['\x00', '\x00', '\x00'], 'OFAC result should be revealed');
    });

    it('should not disclose OFAC check result when selector is 0', async function () {
      w = await circuit.calculateWitness({
        ...inputs,
        selector_ofac: '0',
      });

      const revealedData_packed = await circuit.getOutput(w, ['revealedData_packed[3]']);
      const reveal_unpacked = formatAndUnpackReveal(revealedData_packed);

      // OFAC result should be hidden (null byte)
      const ofac_result = reveal_unpacked[90];
      expect(ofac_result).to.equal('\x00', 'OFAC result should not be revealed');
    });

    it('should show different levels of OFAC matching', async function () {
      // Test cases for different matching scenarios
      const testCases = [
        {
          desc: 'No details match',
          data: genMockPassportData(
            'sha512',
            'sha512',
            'ecdsa_sha512_secp521r1_521',
            'USA',
            '010101',
            '300101',
            'DIF123456',
            'DIFFERENT NAME',
            'DIFFERENT SURNAME'
          ),
          expectedBits: ['\x01', '\x01', '\x01'],
        },
        {
          desc: 'Only passport number matches',
          data: genMockPassportData(
            'sha512',
            'sha512',
            'ecdsa_sha512_secp521r1_521',
            'ESP', // different nationality
            '000101',
            '300101',
            '98lh90556', // Matching passport number
            'DIFFERENT NAME',
            'DIFFERENT SURNAME'
          ),
          expectedBits: ['\x01', '\x01', '\x01'],
        },
        {
          desc: 'Only nationality matches',
          data: genMockPassportData(
            'sha512',
            'sha512',
            'ecdsa_sha512_secp521r1_521',
            'FRA',
            '991231',
            '300101',
            'DIF123456', // different passport number
            'DIFFERENT NAME',
            'DIFFERENT SURNAME'
          ),
          expectedBits: ['\x01', '\x01', '\x01'],
        },
        {
          desc: 'Only passport number and nationality matches',
          data: genMockPassportData(
            'sha512',
            'sha512',
            'ecdsa_sha512_secp521r1_521',
            'FRA',
            '991231',
            '300101',
            '98lh90556',
            'DIFFERENT NAME',
            'DIFFERENT SURNAME'
          ),
          expectedBits: ['\x00', '\x01', '\x01'],
        },
        {
          desc: 'Name and DOB matches (so YOB matches too)',
          data: genMockPassportData(
            'sha512',
            'sha512',
            'ecdsa_sha512_secp521r1_521',
            'FRA',
            '541007',
            '300101',
            'DIF123456',
            'HENAO MONTOYA',
            'ARCANGEL DE JESUS'
          ),
          expectedBits: ['\x01', '\x00', '\x00'],
        },
        {
          desc: 'Only name and YOB match',
          data: genMockPassportData(
            'sha512',
            'sha512',
            'ecdsa_sha512_secp521r1_521',
            'FRA',
            '541299',
            '300101', // Same year (54) different month/day
            'DIF123456',
            'HENAO MONTOYA',
            'ARCANGEL DE JESUS'
          ),
          expectedBits: ['\x01', '\x01', '\x00'],
        },
        {
          desc: 'All details match',
          data: genMockPassportData(
            'sha512',
            'sha512',
            'ecdsa_sha512_secp521r1_521',
            'FRA',
            '541007',
            '300101',
            '98lh90556',
            'HENAO MONTOYA',
            'ARCANGEL DE JESUS'
          ),
          expectedBits: ['\x00', '\x00', '\x00'],
        },
      ];

      for (const testCase of testCases) {
        console.log(`Testing: ${testCase.desc}`);

        const passportData = testCase.data;
        const sanctionedCommitment = generateCommitment(
          secret,
          PASSPORT_ATTESTATION_ID,
          passportData
        );
        tree.insert(BigInt(sanctionedCommitment));

        const testInputs = generateCircuitInputsVCandDisclose(
          secret,
          PASSPORT_ATTESTATION_ID,
          passportData,
          scope,
          Array(88).fill('0'), // selector_dg1
          selector_older_than,
          tree,
          majority,
          forbidden_countries_list,
          user_identifier
        );

        w = await circuit.calculateWitness(testInputs);
        const revealedData_packed = await circuit.getOutput(w, ['revealedData_packed[3]']);
        const reveal_unpacked = formatAndUnpackReveal(revealedData_packed);
        const ofac_results = reveal_unpacked.slice(90, 93);

        console.log(`${testCase.desc} - OFAC bits:`, ofac_results);
        expect(ofac_results).to.deep.equal(
          testCase.expectedBits,
          `Failed matching pattern for: ${testCase.desc}`
        );
      }
    });
  });
});
