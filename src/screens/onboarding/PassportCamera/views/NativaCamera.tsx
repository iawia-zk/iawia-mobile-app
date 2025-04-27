import React, { useCallback } from 'react';
import extractMRZInfo from 'helpers/extractMrz';
import { NativeSyntheticEvent, PixelRatio, Platform, requireNativeComponent } from 'react-native';
import { RCTPassportOCRViewManagerProps, TNativeCameraProps } from '../PassportCamera.types';
import { assert } from 'helpers/assertions';
import RCTFragment from './RctFragment';
import { MrzResult } from 'helpers/extractMrz/extractMrz.types';

const RCTPassportOCRViewNativeComponent = Platform.select({
  ios: requireNativeComponent('PassportOCRView'),
  android: requireNativeComponent('PassportOCRViewManager'),
});

assert(
  RCTPassportOCRViewNativeComponent,
  'PassportOCRViewManager not registered for this platform'
);

function NativeCamera({ onPassportRead, isMounted }: TNativeCameraProps) {
  const onError = useCallback(
    (
      event: NativeSyntheticEvent<{
        error: string;
        errorMessage: string;
        stackTrace: string;
      }>
    ) => {
      if (!isMounted) {
        return;
      }
      /* eslint-disable @typescript-eslint/no-unused-vars */
      const { error, errorMessage, stackTrace } = event.nativeEvent;
      const e = new Error(errorMessage);
      e.stack = stackTrace;
      onPassportRead(e);
    },
    [onPassportRead, isMounted]
  );

  const _onPassportRead = useCallback(
    (
      event: NativeSyntheticEvent<{
        data: string | MrzResult;
      }>
    ) => {
      if (!isMounted) {
        return;
      }
      if (typeof event.nativeEvent.data === 'string') {
        onPassportRead(null, extractMRZInfo(event.nativeEvent.data));
      } else {
        onPassportRead(null, {
          documentNumber: event.nativeEvent.data.documentNumber,
          birthDate: event.nativeEvent.data.birthDate,
          expiryDate: event.nativeEvent.data.expiryDate,
        });
      }
    },
    [onPassportRead, isMounted]
  );

  if (!RCTPassportOCRViewNativeComponent) {
    return <></>;
  }

  if (Platform.OS === 'ios') {
    return (
      <RCTPassportOCRViewNativeComponent
        // @ts-ignore
        onPassportRead={onPassportRead}
        onError={onError}
        style={{
          width: '130%',
          height: '130%',
        }}
      />
    );
  } else {
    // For Android, wrap the native component inside your RCTFragment to preserve existing functionality.
    const Fragment = RCTFragment as React.FC<RCTPassportOCRViewManagerProps>;
    return (
      <Fragment
        RCTFragmentViewManager={RCTPassportOCRViewNativeComponent}
        fragmentComponentName="PassportOCRViewManager"
        isMounted={isMounted}
        style={{
          height: PixelRatio.getPixelSizeForLayoutSize(800),
          width: PixelRatio.getPixelSizeForLayoutSize(400),
        }}
        onError={onError}
        onPassportRead={_onPassportRead}
      />
    );
  }
}

export default NativeCamera;
