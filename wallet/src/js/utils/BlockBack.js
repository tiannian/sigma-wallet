import { useEffect } from 'react';
import { useLocation } from 'wouter';

export function useBlockBack(blockBackPaths) {
  const [location] = useLocation();

  useEffect(() => {
    if (!blockBackPaths.includes(location)) {
      return;
    }

    window.history.pushState(null, document.title, window.location.href);

    const onPopState = e => {
      if (blockBackPaths.includes(window.location.pathname)) {
        window.history.pushState(null, document.title, window.location.href);
      }
    };

    window.addEventListener('popstate', onPopState);

    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, [location]);
}
