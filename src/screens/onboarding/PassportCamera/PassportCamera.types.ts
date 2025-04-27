import { NativeSyntheticEvent, requireNativeComponent } from 'react-native';
import { MrzResult } from 'helpers/extractMrz/extractMrz.types';

export type TNativeCameraProps = {
  isMounted: boolean;
  onPassportRead: (error: Error | null, mrzData?: MrzResult) => void;
};

export interface RCTFragmentViewManagerProps {
  RCTFragmentViewManager: ReturnType<typeof requireNativeComponent>;
  fragmentComponentName: string;
  isMounted: boolean;
  style: {
    width: number;
    height: number;
  };
  onError: (
    event: NativeSyntheticEvent<{
      error: string;
      errorMessage: string;
      stackTrace: string;
    }>
  ) => void;
}

export interface RCTPassportOCRViewManagerProps extends RCTFragmentViewManagerProps {
  onPassportRead: (
    event: NativeSyntheticEvent<{
      data: string | MrzResult;
    }>
  ) => void;
}

export interface FragmentProps {
  isMounted: boolean;
}
