export type THeaderStepperProps = {
  totalSteps: number;
  currentStep: number;
  fillType?: THeaderStepperFillType;
};

export type THeaderStepperFillType = 'zeroToFull' | 'zeroToHalf' | 'halfToFull';

export type TStepProps = {
  active: boolean;
  completed: boolean;
  fillType: THeaderStepperFillType;
};

export type TAnimatedStepProps = {
  fillType: THeaderStepperFillType;
  width: number;
};
