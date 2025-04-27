// TODO: fix file paths for node_modules, files, etc.
import { expect } from 'chai';
import path from 'path';
import { wasm as wasm_tester } from 'circom_tester';
import { genMockPassportData } from 'helpers/parsePassport/generateMockData';
import { formatInput } from 'helpers/circuits/generateInputs';
import { formatMrz } from 'helpers/parsePassport/format';
import { formatCountriesList } from 'helpers/parsePassport/format';
import { formatAndUnpackForbiddenCountriesList } from 'helpers/circuits/formatOutputs';

describe('ProveCountryIsNotInList', function () {
  this.timeout(0);
  let circuit;

  this.beforeAll(async () => {
    const circuitPath = path.resolve(
      __dirname,
      '../../circuits/tests/utils/proveCountryIsNotInList_tester.circom'
    );
    circuit = await wasm_tester(circuitPath, {
      include: [
        'node_modules',
        './node_modules/@zk-kit/binary-merkle-root.circom/src',
        './node_modules/circomlib/circuits',
      ],
    });
  });

  describe('ProveCountryIsNotInList', async () => {
    const passportData = genMockPassportData(
      'sha512',
      'sha512',
      'ecdsa_sha512_secp521r1_521',
      'FRA',
      '000101',
      '300101'
    );
    const dg1 = formatMrz(passportData.mrz);

    it('should succeed', async () => {
      const forbiddenCountriesList = [
        'AAA',
        'USA',
        'ITA',
        'ABC',
        'DZA',
        'USA',
        'ITA',
        'ABC',
        'DZA',
        'USA',
        'ITA',
        'ABC',
        'DZA',
        'USA',
        'ITA',
        'ABC',
        'DZA',
        'USA',
        'ITA',
        'ABC',
        'DNK',
        'USA',
        'DNK',
        'ABC',
        'DNK',
        'USA',
        'DNK',
        'ABC',
        'DNK',
        'USA',
        'ITA',
        'ABC',
        'DZA',
        'USA',
        'ITA',
        'XXX',
        'DZA',
        'USA',
        'ITA',
        'END',
      ];

      const inputs = {
        dg1: formatInput(dg1),
        forbidden_countries_list: formatInput(formatCountriesList(forbiddenCountriesList)),
      };
      const witness = await circuit.calculateWitness(inputs);
      const forbidden_countries_list_packed = await circuit.getOutput(witness, [
        'forbidden_countries_list_packed[4]',
      ]);
      console.log(
        '\x1b[34m%s\x1b[0m',
        'forbidden_countries_list_packed',
        formatAndUnpackForbiddenCountriesList(forbidden_countries_list_packed)
      );
    });

    it('should faild - country FRA is in the list', async () => {
      try {
        const forbiddenCountriesList = ['DZA', 'FRA'];
        const inputs = {
          dg1: formatInput(dg1),
          forbidden_countries_list: formatInput(formatCountriesList(forbiddenCountriesList)),
        };
        const witness = await circuit.calculateWitness(inputs);
      } catch (error) {
        expect(error.message).to.include('Assert Failed');
      }
    });

    it('should faild - country FRA is in the list', async () => {
      try {
        const forbiddenCountriesList = [
          'XXX',
          'XXX',
          'XXX',
          'XXX',
          'XXX',
          'XXX',
          'XXX',
          'XXX',
          'XXX',
          'FRA',
        ];
        const inputs = {
          dg1: formatInput(dg1),
          forbidden_countries_list: formatInput(formatCountriesList(forbiddenCountriesList)),
        };
        const witness = await circuit.calculateWitness(inputs);
        expect.fail('Expected an error but none was thrown.');
      } catch (error) {
        expect(error.message).to.include('Assert Failed');
      }
    });

    it('should succeed - XRA and AXX are in the list, not FRA', async () => {
      const forbiddenCountriesList = [
        'XFR',
        'AXX',
        'XXX',
        'XXX',
        'XXX',
        'XXX',
        'XXX',
        'XFR',
        'AXX',
        'XXX',
      ];
      const inputs = {
        dg1: formatInput(dg1),
        forbidden_countries_list: formatInput(formatCountriesList(forbiddenCountriesList)),
      };
      const witness = await circuit.calculateWitness(inputs);
    });
  });
});
