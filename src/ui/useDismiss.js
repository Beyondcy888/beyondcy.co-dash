import { useEffect } from 'react';

/** Closes a popover on a click outside `ref` or on Escape (focus goes back to `returnRef`). */
export function useDismiss(ref, open, onClose, returnRef = null) {
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    const onKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
        returnRef?.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [ref, open, onClose, returnRef]);
}
