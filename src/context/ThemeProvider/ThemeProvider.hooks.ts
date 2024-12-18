import { useEffect, useRef, useState } from 'react';
import { useColorScheme } from 'react-native';

export function useChangeThemeWorkaround() {
  const systemThemeType = useColorScheme();
  const [currentSystemThemeType, setCurrentSystemThemeType] = useState(systemThemeType);
  const onColorSchemeChange = useRef<NodeJS.Timeout>();

  // TODO: (melih) after react native 0.73+ we don't need this logic
  // https://github.com/facebook/react-native/issues/35972
  useEffect(() => {
    if (systemThemeType !== currentSystemThemeType) {
      onColorSchemeChange.current = setTimeout(
        () => setCurrentSystemThemeType(systemThemeType),
        1000
      );
    } else if (onColorSchemeChange.current) {
      clearTimeout(onColorSchemeChange.current);
    }
  }, [systemThemeType]);

  return currentSystemThemeType;
}
