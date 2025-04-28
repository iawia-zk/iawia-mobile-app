/* eslint-disable no-bitwise */
import { assert } from 'helpers/assertions';

export class Formatter {
  static MAX_FORBIDDEN_COUNTRIES_LIST_LENGTH = 40;

  static formatName(input: string): [string, string] {
    let lastName = '';
    let firstName = '';
    let i = 0;

    while (i < input.length && input[i] !== '<') {
      lastName += input[i];
      i++;
    }

    i += 2;

    while (i < input.length) {
      if (input[i] === '<') {
        if (i + 1 < input.length && input[i + 1] === '<') {
          break;
        }
        firstName += ' ';
      } else {
        firstName += input[i];
      }
      i++;
    }

    return [firstName, lastName];
  }

  static formatDate(date: string): string {
    assert(date.length === 6, 'Invalid date length');
    const dateBytes = Array.from(date);

    for (let i = 0; i < 6; i++) {
      assert(dateBytes[i] >= '0' && dateBytes[i] <= '9', 'Invalid ASCII code');
    }

    if (dateBytes[2] > '1' || (dateBytes[2] === '1' && dateBytes[3] > '2')) {
      throw new Error('InvalidMonthRange');
    }

    if (dateBytes[4] > '3' || (dateBytes[4] === '3' && dateBytes[5] > '1')) {
      throw new Error('InvalidDayRange');
    }

    const year = date.substring(0, 2);
    const month = date.substring(2, 4);
    const day = date.substring(4, 6);

    return `${day}-${month}-${year}`;
  }

  static numAsciiToUint(numAscii: number): number {
    assert(numAscii >= 48 && numAscii <= 57, 'Invalid ASCII code');
    return numAscii - 48;
  }

  static fieldElementsToBytes(publicSignals: [bigint, bigint, bigint]): Uint8Array {
    const bytesCount = [31, 31, 31];
    const totalLength = 93;
    const bytesArray = new Uint8Array(totalLength);
    let index = 0;
    for (let i = 0; i < 3; i++) {
      let element = publicSignals[i];
      for (let j = 0; j < bytesCount[i]; j++) {
        const byte = Number(element & 0xffn);
        bytesArray[index++] = byte;
        element = element >> 8n;
      }
    }
    return bytesArray;
  }

  static bytesToHexString(bytes: Uint8Array): string {
    return (
      '0x' +
      Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
    );
  }

  static extractForbiddenCountriesFromPacked(publicSignal: bigint): string[] {
    const forbiddenCountries: string[] = new Array(Formatter.MAX_FORBIDDEN_COUNTRIES_LIST_LENGTH);

    for (let j = 0; j < Formatter.MAX_FORBIDDEN_COUNTRIES_LIST_LENGTH; j++) {
      const byteIndex = BigInt(j * 3);
      const shift = byteIndex * 8n;
      const mask = 0xffffffn;
      const packedData = (publicSignal >> shift) & mask;
      const char1 = String.fromCharCode(Number((packedData >> 16n) & 0xffn));
      const char2 = String.fromCharCode(Number((packedData >> 8n) & 0xffn));
      const char3 = String.fromCharCode(Number(packedData & 0xffn));

      forbiddenCountries[j] = char1 + char2 + char3;
    }
    return forbiddenCountries;
  }

  static proofDateToUnixTimestamp(dateNum: number[]): number {
    assert(dateNum.length === 6, 'Invalid date length');

    let date = '';
    for (let i = 0; i < 6; i++) {
      date += String.fromCharCode(48 + (dateNum[i] % 10));
    }
    return Formatter.dateToUnixTimestamp(date);
  }

  static dateToUnixTimestamp(date: string): number {
    assert(date.length === 6, 'Invalid date length');

    const yearPart = Formatter.substring(date, 0, 2);
    const monthPart = Formatter.substring(date, 2, 4);
    const dayPart = Formatter.substring(date, 4, 6);
    const year = Formatter.parseDatePart(yearPart) + 2000;
    const month = Formatter.parseDatePart(monthPart);
    const day = Formatter.parseDatePart(dayPart);

    return Formatter.toTimestamp(year, month, day);
  }

  static substring(str: string, startIndex: number, endIndex: number): string {
    return str.substring(startIndex, endIndex);
  }

  static parseDatePart(value: string): number {
    if (value.length === 0) {
      return 0;
    }
    let result = 0;
    for (let i = 0; i < value.length; i++) {
      const digit = value.charCodeAt(i) - 48;
      result = result * 10 + digit;
    }
    return result;
  }

  static toTimestamp(year: number, month: number, day: number): number {
    let timestamp = 0;
    const secondsInDay = 86400;
    for (let i = 1970; i < year; i++) {
      timestamp += Formatter.isLeapYear(i) ? 366 * secondsInDay : 365 * secondsInDay;
    }
    const monthDayCounts = [
      31,
      Formatter.isLeapYear(year) ? 29 : 28,
      31,
      30,
      31,
      30,
      31,
      31,
      30,
      31,
      30,
      31,
    ];
    for (let i = 1; i < month; i++) {
      timestamp += monthDayCounts[i - 1] * secondsInDay;
    }
    timestamp += (day - 1) * secondsInDay;
    return timestamp;
  }

  static isLeapYear(year: number): boolean {
    if (year % 4 !== 0) {
      return false;
    } else if (year % 100 !== 0) {
      return true;
    } else if (year % 400 !== 0) {
      return false;
    } else {
      return true;
    }
  }
}
