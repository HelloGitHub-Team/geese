import { useCallback, useEffect, useState } from 'react';

export default function useStorageListener(storageKey: string) {
  const [hasToken, setHasToken] = useState<boolean>(false);

  const eventListener = useCallback(
    (event: StorageEvent) => {
      const { key, newValue } = event;
      setHasToken(key === storageKey && newValue !== '');
    },
    [storageKey]
  );

  useEffect(() => {
    window.addEventListener('storage', eventListener);
    return () => window.removeEventListener('storage', eventListener);
  }, [eventListener]);

  return {
    hasToken,
    setHasToken,
  };
}
