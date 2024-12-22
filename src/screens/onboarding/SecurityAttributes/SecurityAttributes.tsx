import React, { useLayoutEffect } from 'react';

import Box from 'components/core/Box';

import { NavigationHeaderStepper } from 'components/Navigation';
import { TNavigationProps } from 'screens/AppNavigation.types';
import ScrollView from 'components/ScrollView';
import BottomInsetBox from 'components/BottomInsetBox';
import Button from 'components/core/Button';
import { useOnboardingContext } from 'context/OnboardingProvider';
import Avatar from 'components/core/Avatar';
import Text from 'components/core/Text';
import capitalizeName from 'helpers/capitalizeName';
import Card from 'components/core/Card';
import InfoItem from 'components/core/InfoItem';
import { yymmddToDate } from 'helpers/date/date';

function SecurityAttributes({ navigation }: TNavigationProps<'SecurityAttributes'>) {
  const { onboardingState } = useOnboardingContext();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: (props) => <NavigationHeaderStepper currentStep={3} totalSteps={3} {...props} />,
    });
  }, []);

  return (
    <Box flex={1}>
      <ScrollView>
        <Box height={'100%'} gap={'m'}>
          <Box flexDirection="row" gap={'m'} alignItems="center">
            <Avatar imageUrl={onboardingState.passportData?.photo.base64} size="large" />
            <Text variant={'titleSection'}>
              {capitalizeName(
                onboardingState.passportData?.firstName,
                onboardingState.passportData?.lastName
              )}
            </Text>
          </Box>
          <Card gap={'s'} padding={'s'}>
            <InfoItem
              labelId="screens.securityAttributes.gender"
              value={onboardingState.passportData?.gender}
            />
            <InfoItem
              labelId="screens.securityAttributes.nationality"
              value={onboardingState.passportData?.nationality}
            />
            <InfoItem
              labelId="screens.securityAttributes.expiryDate"
              value={yymmddToDate(onboardingState.expiryDate as string)}
            />
            <InfoItem
              labelId="screens.securityAttributes.dateOfBirth"
              value={yymmddToDate(onboardingState.birthDate as string)}
            />
          </Card>
        </Box>
      </ScrollView>
      <BottomInsetBox alignItems="center" paddingHorizontal="m" gap="m">
        <Button
          labelId="button.generate"
          //   leftIcon={Upload04Icon}
          onPress={() => navigation.navigate('PassportNfcRead')}
        />
      </BottomInsetBox>
    </Box>
  );
}

export default SecurityAttributes;
