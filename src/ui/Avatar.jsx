// A person's photo, falling back to the first letter on a coloured circle, exactly like the
// tracker (same letter rule and the same six tones, by a stable hash of the person's id).
// Never a broken image: the letter stays underneath until the photo has loaded.
import { useEffect, useState } from 'react';
import { initialOf, toneIndex } from '../lib/avatar.js';

export function Avatar({ id = null, name = '', src = null, size = 34, className = '' }) {
  const [state, setState] = useState({ url: null, status: 'idle' });
  useEffect(() => {
    setState((s) => (s.url === src ? s : { url: src, status: 'idle' }));
  }, [src]);
  const status = state.url === src ? state.status : 'idle';
  const showImg = Boolean(src) && status !== 'failed';
  return (
    <span
      className={`b360-avatar${showImg && status === 'loaded' ? ' has-photo' : ''} ${className}`}
      data-tone={toneIndex(id ?? name)}
      style={{ '--av': `${size}px` }}
      aria-hidden="true"
    >
      <span>{initialOf(name)}</span>
      {showImg && (
        <img
          src={src}
          alt=""
          decoding="async"
          draggable={false}
          onLoad={() => setState({ url: src, status: 'loaded' })}
          onError={() => setState({ url: src, status: 'failed' })}
        />
      )}
    </span>
  );
}
