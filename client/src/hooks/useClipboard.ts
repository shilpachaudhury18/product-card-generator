import { useEffect, useRef, useState } from 'react';

type CopyStatus = 'idle' | 'copied' | 'failed';

export function useClipboard(resetAfter = 2000) {
  const [status, setStatus] = useState<CopyStatus>('idle');
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy(text: string) {
    clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(text);
      setStatus('copied');
    } catch {
      // clipboard needs https/localhost and permission
      setStatus('failed');
    }
    timer.current = setTimeout(() => setStatus('idle'), resetAfter);
  }

  return { status, copy };
}
