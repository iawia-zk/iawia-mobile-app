import { useEffect, useState } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

function useNetInfoHandler() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(handleConnectivityChange);
    return () => unsubscribe?.();
  }, []);

  function handleConnectivityChange({ isConnected: newIsConnected }: NetInfoState) {
    setIsConnected(newIsConnected ?? true);
  }

  return { isNetConnected: isConnected };
}

export default useNetInfoHandler;
