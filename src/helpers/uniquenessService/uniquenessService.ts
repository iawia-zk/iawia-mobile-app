import { getJsonFromIpfsByKey } from 'helpers/ipfsService/ipfsService';
import Config from 'react-native-config';

import { sha256 } from 'react-native-sha256';

const USER_LIST_IPFS_KEY = 'bafkreigi3ic4faa242o6qtmdz7ki3v3nweuax7svprxjib2gs4ispvdr3y';

export async function checkIfPassportIdExists(passportId: string): Promise<boolean> {
  console.log('checkIfPassportIdExists');
  const saltyHash = await generateSaltyHash(passportId);
  console.log('saltyHash', saltyHash);
  const userListData: { users: string[] } = await getJsonFromIpfsByKey(USER_LIST_IPFS_KEY);

  if (!userListData) {
    console.error('Error fetching user data from IPFS');
    return true;
  }

  return userListData.users.includes(saltyHash);
}

async function generateSaltyHash(passportId: string): Promise<string> {
  const salt = Config.PINATA_JWT;
  const saltedId = passportId + salt;
  const hash = await sha256(saltedId);
  console.log('hash', hash);
  return hash;
}
