import 'text-encoding';
import { Formatter } from './formatter';

export class CircuitAttributeHandler {
  static ISSUING_STATE_START = 2;
  static ISSUING_STATE_END = 4;
  static NAME_START = 5;
  static NAME_END = 43;
  static PASSPORT_NUMBER_START = 44;
  static PASSPORT_NUMBER_END = 53;
  static NATIONALITY_START = 55;
  static NATIONALITY_END = 57;
  static DATE_OF_BIRTH_START = 58;
  static DATE_OF_BIRTH_END = 63;
  static GENDER_START = 65;
  static GENDER_END = 65;
  static EXPIRY_DATE_START = 66;
  static EXPIRY_DATE_END = 71;
  static OLDER_THAN_START = 88;
  static OLDER_THAN_END = 89;
  static OFAC_START = 90;
  static OFAC_END = 92;

  static getIssuingState(input: string | Uint8Array): string {
    const charcodes = this.normalizeInput(input);
    return this.extractStringAttribute(charcodes, this.ISSUING_STATE_START, this.ISSUING_STATE_END);
  }

  static getName(input: string | Uint8Array): [string, string] {
    const charcodes = this.normalizeInput(input);
    const rawName = this.extractStringAttribute(charcodes, this.NAME_START, this.NAME_END);
    return Formatter.formatName(rawName);
  }

  static getPassportNumber(input: string | Uint8Array): string {
    const charcodes = this.normalizeInput(input);
    return this.extractStringAttribute(
      charcodes,
      this.PASSPORT_NUMBER_START,
      this.PASSPORT_NUMBER_END
    );
  }

  static getNationality(input: string | Uint8Array): string {
    const charcodes = this.normalizeInput(input);
    return this.extractStringAttribute(charcodes, this.NATIONALITY_START, this.NATIONALITY_END);
  }

  static getDateOfBirth(input: string | Uint8Array): string {
    const charcodes = this.normalizeInput(input);
    const rawDate = this.extractStringAttribute(
      charcodes,
      this.DATE_OF_BIRTH_START,
      this.DATE_OF_BIRTH_END
    );
    return Formatter.formatDate(rawDate);
  }

  static getGender(input: string | Uint8Array): string {
    const charcodes = this.normalizeInput(input);
    return this.extractStringAttribute(charcodes, this.GENDER_START, this.GENDER_END);
  }

  static getExpiryDate(input: string | Uint8Array): string {
    const charcodes = this.normalizeInput(input);
    const rawDate = this.extractStringAttribute(
      charcodes,
      this.EXPIRY_DATE_START,
      this.EXPIRY_DATE_END
    );
    return Formatter.formatDate(rawDate);
  }

  static getOlderThan(input: string | Uint8Array): number {
    const charcodes = this.normalizeInput(input);
    const digit1 = Formatter.numAsciiToUint(charcodes[this.OLDER_THAN_START]);
    const digit2 = Formatter.numAsciiToUint(charcodes[this.OLDER_THAN_START + 1]);
    return digit1 * 10 + digit2;
  }

  static getPassportNoOfac(input: string | Uint8Array): number {
    const charcodes = this.normalizeInput(input);
    return charcodes[this.OFAC_START];
  }

  static getNameAndDobOfac(input: string | Uint8Array): number {
    const charcodes = this.normalizeInput(input);
    return charcodes[this.OFAC_START + 1];
  }

  static getNameAndYobOfac(input: string | Uint8Array): number {
    const charcodes = this.normalizeInput(input);
    return charcodes[this.OFAC_START + 2];
  }

  static compareOlderThan(input: string | Uint8Array, olderThan: number): boolean {
    const charcodes = this.normalizeInput(input);
    return this.getOlderThan(charcodes) >= olderThan;
  }

  /**
   * Performs selective OFAC checks based on provided flags.
   * @param input The input string or byte array containing passport attribute data.
   * @param checkPassportNo Whether to check the passport number OFAC status.
   * @param checkNameAndDob Whether to check the name and date of birth OFAC status.
   * @param checkNameAndYob Whether to check the name and year of birth OFAC status.
   * @returns True if all enabled checks pass (equal 1), false if any enabled check fails.
   * @remarks Checks are only performed for flags that are set to true. If a flag is false,
   * that particular check is considered to have passed regardless of its actual value.
   */
  static compareOfac(
    input: string | Uint8Array,
    checkPassportNo: boolean,
    checkNameAndDob: boolean,
    checkNameAndYob: boolean
  ): boolean {
    const charcodes = this.normalizeInput(input);
    return (
      (!checkPassportNo || this.getPassportNoOfac(charcodes) === 1) &&
      (!checkNameAndDob || this.getNameAndDobOfac(charcodes) === 1) &&
      (!checkNameAndYob || this.getNameAndYobOfac(charcodes) === 1)
    );
  }

  private static normalizeInput(input: string | Uint8Array): Uint8Array {
    if (typeof input === 'string') {
      if (input.startsWith('0x')) {
        const hex = input.slice(2);
        const bytes = new Uint8Array(hex.length / 2);
        for (let i = 0; i < hex.length; i += 2) {
          bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
        }
        return bytes;
      }
      return new TextEncoder().encode(input);
    }
    return input;
  }

  static extractStringAttribute(input: string | Uint8Array, start: number, end: number): string {
    const charcodes = this.normalizeInput(input);
    if (charcodes.length <= end) {
      throw new Error('INSUFFICIENT_CHARCODE_LEN');
    }
    const attributeBytes = charcodes.slice(start, end + 1);
    return new TextDecoder('utf-8').decode(attributeBytes);
  }
}
