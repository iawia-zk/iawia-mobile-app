import Box from 'components/core/Box';
import FileUploader from 'components/FileUploader';
import ScrollView from 'components/ScrollView';
import React from 'react';
import { Text } from 'react-native';
import useInitialTransaction from 'hooks/useInitialTransaction';
import Button from 'components/core/Button';

const ZeroKnowledgeProof = () => {
  const { startTransaction, loading } = useInitialTransaction();

  return (
    <ScrollView paddingHorizontal="none">
      <Box gap={'m'} mx={'m'}>
        <Box width={100} height={100} backgroundColor="avatarFire" />
        <Text>Zero Knowledge Proof Screen</Text>
        <FileUploader />
        <Button onPress={startTransaction} labelId="button.startTransaction" loading={loading} />
      </Box>
    </ScrollView>
  );
};

export default ZeroKnowledgeProof;
