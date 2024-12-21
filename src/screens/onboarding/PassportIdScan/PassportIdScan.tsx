import React from 'react';

import Box from 'components/core/Box';

import Text from 'components/core/Text';

// { navigation }: TNavigationProps<'PassportIdScan'>

function PassportIdScan() {
  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerTitle: (props) => <NavigationHeaderStepper currentStep={1} totalSteps={3} {...props} />,
  //   });
  // }, []);

  console.log('ananas');

  return (
    <Box height={'100%'} width={'100%'} backgroundColor={'avatarFire'}>
      <Text id="label.cancel" />
      <button
        onClick={() => {
          console.log('as');
        }}>
        Click me
      </button>
    </Box>
  );
}

export default PassportIdScan;
