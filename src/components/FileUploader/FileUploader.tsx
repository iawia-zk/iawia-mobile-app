import Box from 'components/core/Box';
import Button from 'components/core/Button';
import { uploadFileToPinata } from 'helpers/ipfsService';
import React, { useState } from 'react';
import { Text, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

const FileUploader = () => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleUpload = async () => {
    try {
      setLoading(true);
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
      });

      if (result.didCancel) {
        return;
      }

      if (!result.assets || result.assets.length === 0) {
        Alert.alert('Error', 'No image was selected');
        return;
      }

      const file = {
        uri: result.assets[0].uri,
        type: result.assets[0].type,
        name: result.assets[0].fileName || `image_${Date.now()}.jpg`,
      };

      const ipfsResponse = await uploadFileToPinata(file);
      setFileUrl(`https://gateway.pinata.cloud/ipfs/${ipfsResponse?.IpfsHash}`);
      console.log('ipfsUrl', ipfsResponse);
    } catch (error: any) {
      console.error('Image selection error:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Button labelId="button.proceed" onPress={handleUpload} loading={loading} />
      {fileUrl && <Text>File uploaded: {fileUrl}</Text>}
    </Box>
  );
};

export default FileUploader;
