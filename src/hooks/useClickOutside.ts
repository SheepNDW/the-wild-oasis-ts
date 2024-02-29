import { useEffect, type RefObject } from 'react';

export function useClickOutside(
  ref: RefObject<HTMLElement>,
  onClickOutside: () => void,
  listenCapture = true
) {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClickOutside();
      }
    };

    document.addEventListener('click', handleClick, listenCapture);

    return () => document.removeEventListener('click', handleClick, listenCapture);
  }, [ref, onClickOutside, listenCapture]);
}
