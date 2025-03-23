import { useWalletContext } from 'context/WalletProvider/WalletProvider';
import { ZKType } from 'enums/ZKType';
import { uploadFileToPinata } from 'helpers/pinataUpload';
import { TWalletData, TSnark } from 'context/WalletProvider/WalletProvider.types';
import RNFS from 'react-native-fs';
import { useState } from 'react';

function useInitialTransaction() {
  const { walletDispatch } = useWalletContext();
  const [loading, setLoading] = useState(false);
  async function generateSnarks(): Promise<TSnark[]> {
    const snarks = [];

    // Create test files for each ZK type
    for (const zkType of Object.values(ZKType)) {
      // Create a temporary file with test data
      const tempFilePath = `${RNFS.CachesDirectoryPath}/${zkType.toLowerCase()}_test.json`;
      const testData = {
        type: zkType,
        proof: 'test_proof_data',
        timestamp: new Date().toISOString(),
      };

      await RNFS.writeFile(tempFilePath, JSON.stringify(testData), 'utf8');

      const file = {
        uri: tempFilePath,
        type: 'application/json',
        name: `${zkType.toLowerCase()}_test.json`,
      };

      const uploadResponse = await uploadFileToPinata(file);

      if (uploadResponse?.IpfsHash) {
        snarks.push({
          type: zkType,
          ipfsHash: uploadResponse.IpfsHash,
        });
      }

      await RNFS.unlink(tempFilePath);
    }

    return snarks;
  }

  async function startTransaction() {
    setLoading(true);
    const snarks = await generateSnarks();
    const walletData: TWalletData = {
      snarks,
    };
    walletDispatch.sendInitialTransaction(walletData);
    setLoading(false);
  }

  return { loading, startTransaction };
}

export default useInitialTransaction;
