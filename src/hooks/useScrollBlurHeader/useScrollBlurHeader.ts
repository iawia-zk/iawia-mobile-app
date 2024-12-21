import { useEffect, useMemo, useRef } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useTheme } from '@shopify/restyle';
import { useHeaderHeight } from '@react-navigation/elements';

import spacing from 'theme/spacing';
import { IS_IOS } from 'constants/platform';
import { CHILD_STACK_PREFIX } from 'theme/navigation';
import { useThemeContext } from 'context/ThemeProvider';

function useScrollBlurHeader() {
  const isFocused = useIsFocused();
  const headerHeight = useHeaderHeight();
  const navigation = useNavigation();
  const { themeDispatch } = useThemeContext();
  const childStackHeaderHeight =
    IS_IOS && navigation.getParent(CHILD_STACK_PREFIX as never) ? 40 : 0;

  const headerBlurOffset = useMemo(
    () => -headerHeight + childStackHeaderHeight + spacing.m,
    [headerHeight]
  );
  const isHeaderBlur = useRef(false);
  const { colors } = useTheme();
  const setOptions = useMemo(() => navigation?.setOptions, []);

  useEffect(() => {
    if (setOptions) {
      setOptions({
        headerStyle: {
          backgroundColor: colors.backgroundPrimary,
        },
      });
    }
  }, [themeDispatch.getThemeValue()]);

  function onScrollIosHandler(event: NativeSyntheticEvent<NativeScrollEvent>) {
    if (event.nativeEvent.contentOffset.y > headerBlurOffset) {
      if (!isHeaderBlur.current && isFocused) {
        isHeaderBlur.current = true;
        setOptions({
          headerStyle: {
            backgroundColor: colors.transparent,
          },
          headerShadowVisible: true,
        });
      }
    }

    if (event.nativeEvent.contentOffset.y <= headerBlurOffset) {
      if (isHeaderBlur.current && isFocused) {
        isHeaderBlur.current = false;
        setOptions({
          headerStyle: {
            backgroundColor: colors.backgroundPrimary,
          },
          headerShadowVisible: false,
        });
      }
    }
  }

  function onScrollAndroidHandler(event: NativeSyntheticEvent<NativeScrollEvent>) {
    if (event.nativeEvent.contentOffset.y > spacing.m) {
      if (!isHeaderBlur.current) {
        isHeaderBlur.current = true;
        setOptions({
          headerStyle: {
            backgroundColor: colors.backgroundPrimary,
          },
          headerShadowVisible: true,
        });
      }
    }
    if (event.nativeEvent.contentOffset.y <= 0) {
      if (isHeaderBlur.current) {
        isHeaderBlur.current = false;
        setOptions({
          headerStyle: {
            backgroundColor: colors.backgroundPrimary,
          },
          headerShadowVisible: false,
        });
      }
    }
  }

  return { onScrollHandler: IS_IOS ? onScrollIosHandler : onScrollAndroidHandler };
}

export default useScrollBlurHeader;
