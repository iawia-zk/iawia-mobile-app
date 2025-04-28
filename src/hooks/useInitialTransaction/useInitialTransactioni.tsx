import { useWalletContext } from 'context/WalletProvider/WalletProvider';
import { uploadFileToPinata } from 'helpers/ipfsService';
import RNFS from 'react-native-fs';
import { useState } from 'react';
import { PassportTransactionData } from 'types/passportData';
import Toast from 'react-native-toast-message';

function useInitialTransaction() {
  const { walletDispatch } = useWalletContext();
  const [loading, setLoading] = useState(false);
  async function generateTransactionFile(data: PassportTransactionData) {
    console.log('generateTransactionFile', data);
    const tempFilePath = `${RNFS.CachesDirectoryPath}/${data.documentNumber}_test.json`;

    await RNFS.writeFile(tempFilePath, JSON.stringify(data), 'utf8');

    const file = {
      uri: tempFilePath,
      type: 'application/json',
      name: `${data.documentNumber}_test.json`,
    };

    console.log('file', file);
    const uploadResponse = await uploadFileToPinata(file);
    console.log('uploadResponse', uploadResponse);

    if (uploadResponse?.IpfsHash) {
      return uploadResponse.IpfsHash;
    }

    await RNFS.unlink(tempFilePath);
    return undefined;
  }

  async function startTransaction(data: PassportTransactionData) {
    setLoading(true);
    const ipfsHash = await generateTransactionFile(data);

    if (!ipfsHash) {
      setLoading(false);
      Toast.show({
        type: 'error',
        text1: 'Could not create transaction file',
      });
      return;
    }
    console.log('ipfsHash', ipfsHash);
    walletDispatch.sendInitialTransaction(ipfsHash);
    setLoading(false);
  }

  return { loading, startTransaction };
}

export default useInitialTransaction;
