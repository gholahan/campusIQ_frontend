import { useEffect } from 'react';

export function useScrollToTopOnStep(step: number) {
  useEffect(() => {
    const container = document.querySelector('main');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [step]);
}
