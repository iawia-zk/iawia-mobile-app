import React, { useEffect, useRef } from 'react';
import { RCTFragmentViewManagerProps } from '../PassportCamera.types';
import { findNodeHandle } from 'react-native';
import { dispatchNativeCommand } from '../PassportCamera.helpers';

function RCTFragment({
  RCTFragmentViewManager,
  fragmentComponentName,
  isMounted,
  ...props
}: RCTFragmentViewManagerProps) {
  const ref = useRef(null);

  useEffect(() => {
    const viewId = findNodeHandle(ref.current);
    if (!viewId) {
      return;
    }

    console.log('RCTFragment', viewId, fragmentComponentName, isMounted);

    if (isMounted) {
      dispatchNativeCommand(fragmentComponentName, viewId, 'create');
    } else {
      dispatchNativeCommand(fragmentComponentName, viewId, 'destroy');
    }
  }, [ref, fragmentComponentName, isMounted]);

  return <RCTFragmentViewManager ref={ref} {...props} />;
}

export default RCTFragment;
