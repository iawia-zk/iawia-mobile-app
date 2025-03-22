import { useEffect, useState, useRef } from 'react';

import { TUseTimeout } from './useTimeout.types';

const useTimeout = ({ callback, delay = 3000, autoStart = true }: TUseTimeout) => {
  const [start, setStart] = useState(autoStart);
  const savedCallback = useRef<any>(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    let timeoutId: any;

    function timeoutCallback() {
      savedCallback.current?.();

      if (!autoStart) {
        setStart(false);
      }
    }

    if (start) {
      timeoutId = setTimeout(timeoutCallback, delay);
    }

    return () => clearTimeout(timeoutId);
  }, [delay, start]);

  return [setStart];
};

export default useTimeout;
