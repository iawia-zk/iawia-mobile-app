import React from 'react';
import Box from 'components/core/Box';
import Text from 'components/core/Text';
import PhaseItem from './PhaseItem';

function OnboardingResultPhases() {
  return (
    <Box>
      <Box flex={1} alignItems="center" justifyContent="center">
        <Text variant="titleSubsection">We we get ready your privacy!</Text>
      </Box>
      <Box flex={1} gap={'m'}>
        <PhaseItem phaseNo={1} textId="screens.onboardingResult.phase1" />
        <PhaseItem phaseNo={2} textId="screens.onboardingResult.phase2" />
        <PhaseItem phaseNo={3} textId="screens.onboardingResult.phase3" />
      </Box>
    </Box>
  );
}

export default OnboardingResultPhases;
