import axios from 'axios';
import Config from 'react-native-config';
import { PinataUploadResponse } from './ipfsService.types';

const PINATA_JWT = Config.PINATA_JWT;

export const uploadFileToPinata = async (file: any) => {
  try {
    const fileUri = file.uri;
    const fileType = file.type || 'application/octet-stream';
    const fileName = file.name || `file_${Date.now()}`;

    let fileData = {
      uri: fileUri,
      type: fileType,
      name: fileName,
    };

    const formData = new FormData();
    formData.append('file', fileData);

    const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${PINATA_JWT}`,
      },
      transformRequest: (data) => {
        return data; // Don't transform the data
      },
    });

    console.log('response', response);

    // return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
    return response.data as PinataUploadResponse;
  } catch (error) {
    console.error('Error uploading file to Pinata:', error);
    if (axios.isAxiosError(error)) {
      console.error('Response data:', error.response?.data);
    }
    return null;
  }
};

export const getJsonFromIpfsByKey = async (key: string) => {
  try {
    const res = await fetch('https://gateway.pinata.cloud/ipfs/' + key);
    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error fetching JSON from IPFS:', error);
    return null;
  }
};
