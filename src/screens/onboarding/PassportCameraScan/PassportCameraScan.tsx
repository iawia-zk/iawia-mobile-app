import React, { useCallback, useRef } from 'react';
import { Image, Platform } from 'react-native';
import IMAGES from 'constants/images';

import { useIsFocused, useNavigation } from '@react-navigation/native';

import Box from 'components/core/Box';
import ScrollView from 'components/ScrollView';
import PageHeader from 'components/PageHeader';

import { PassportCamera, PassportCameraProps } from 'components/PassportCamera/PassportCamera';
import useUserStore from 'stores/userStore';
import { formatDateToYYMMDD } from 'helpers/date/date';
import { checkScannedInfo } from 'helpers/parsePassport/parseUtils';

interface PassportNFCScanScreen {}

const PassportCameraScan: React.FC<PassportNFCScanScreen> = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const store = useUserStore();

  // Add a ref to track when the camera screen is mounted
  const scanStartTimeRef = useRef(Date.now());

  const onPassportRead = useCallback<PassportCameraProps['onPassportRead']>(
    (error, result) => {
      // Calculate scan duration in seconds with exactly 2 decimal places
      const scanDurationSeconds = ((Date.now() - scanStartTimeRef.current) / 1000).toFixed(2);

      if (error) {
        console.error(error);
        // TODO: Add error handling here
        return;
      }

      if (!result) {
        console.error('No result from passport scan');
        return;
      }

      const { passportNumber, dateOfBirth, dateOfExpiry } = result;

      const formattedDateOfBirth =
        Platform.OS === 'ios' ? formatDateToYYMMDD(dateOfBirth) : dateOfBirth;
      const formattedDateOfExpiry =
        Platform.OS === 'ios' ? formatDateToYYMMDD(dateOfExpiry) : dateOfExpiry;

      if (!checkScannedInfo(passportNumber, formattedDateOfBirth, formattedDateOfExpiry)) {
        // navigation.navigate('PassportCameraTrouble');
        return;
      }

      store.update({
        passportNumber,
        dateOfBirth: formattedDateOfBirth,
        dateOfExpiry: formattedDateOfExpiry,
      });

      navigation.navigate('PassportNfcRead');
    },
    [store, navigation]
  );

  return (
    <Box flex={1}>
      {isFocused ? (
        <PassportCamera onPassportRead={onPassportRead} isMounted={isFocused} />
      ) : (
        <ScrollView>
          <Box alignItems="center" mt={'xl'} gap={'l'} flex={1} justifyContent="center">
            <PageHeader
              titleId="screens.passportCameraScan.title"
              descriptionId="screens.passportCameraScan.description"
            />
            <Image source={IMAGES.passportDrawing} style={styles.image} />
          </Box>
        </ScrollView>
      )}
    </Box>
  );
};

export default PassportCameraScan;

const styles = {
  image: {
    height: 258,
    resizeMode: 'contain',
  },
};
