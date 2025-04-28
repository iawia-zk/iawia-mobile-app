import { PassportTransactionData } from 'types/passportData';

export function parsePassportTransactionData(data: string): PassportTransactionData {
  const decodedData = Buffer.from(data, 'base64').toString('utf8');
  const parsedData = JSON.parse(decodedData);
  return parsedData;
}
