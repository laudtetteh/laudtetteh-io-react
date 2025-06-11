/**
 * FlashMessage
 * Displays flash messages with animation, icons, and actions.
 */
import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { useRouter } from 'next/router';

import FlashIcon from './FlashIcon';
import FlashActions from './FlashActions';

type FlashType = 'success' | 'error' | 'info' | 'confirm';
type FlashPosition =
  | 'top-center'
  | 'top-left'
  | 'top-right'
  | 'bottom-center'
  | 'bottom-left'
  | 'bottom-right';

type FlashItem = {
  message: string;
  position: FlashPosition;
  type?: FlashType;
  action?: { label: string; onClick: () => void };
  confirmId?: string;
};

const POSITIONS: Record<FlashPosition, string> = {
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'top-left': 'top-4 left-4',
  'top-right': 'top-4 right-4',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  'bottom-left': 'bottom-4 left-4',
  'bottom-right': 'bottom-4 right-4',
};

/**
 * FlashMessage component
 * Displays flash messages with animation, icons, and actions.
 */
export default function FlashMessage() {
  const [queue, setQueue] = useState<FlashItem[]>([]);
  const [current, setCurrent] = useState<FlashItem | null>(null);
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  useEffect(() => {
    const showFlash = () => {
      const raw = sessionStorage.getItem('flashQueue');
      if (raw) {
        try {
          const msgs: FlashItem[] = JSON.parse(raw);
          setQueue((prev) => [...prev, ...msgs]);
        } catch (e) {
          console.error('Failed to parse flashQueue:', e);
        }
        sessionStorage.removeItem('flashQueue');
      }
    };

    showFlash();
    router.events.on('routeChangeComplete', showFlash);
    return () => router.events.off('routeChangeComplete', showFlash);
  }, [router.events]);

  useEffect(() => {
    if (!visible && queue.length > 0) {
      const [next, ...rest] = queue;
      setCurrent(next);
      setQueue(rest);
      setVisible(true);

      if (next.type !== 'confirm') {
        timeoutRef.current = setTimeout(() => {
          handleClose();
        }, 3000);
      }
    }
  }, [queue, visible]);

  const handleClose = () => {
    setVisible(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setTimeout(() => setCurrent(null), 300);
  };

  const resolveConfirm = (value: boolean) => {
    if (!current?.confirmId) return;
    const channel = new BroadcastChannel('flashConfirm');
    channel.postMessage({ id: current.confirmId, result: value });
    channel.close();
    handleClose();
  };

  if (!current) return null;

  const { message, position, type = 'info', action } = current;

  const baseClasses = classNames(
    'fixed z-50 px-5 py-4 rounded shadow-md text-white transition-all duration-300 transform flex flex-col items-center justify-between gap-4 w-[90vw] max-w-sm',
    POSITIONS[position] || POSITIONS['top-center'],
    {
      'bg-green-600': type === 'success',
      'bg-red-600': type === 'error',
      'bg-blue-600': type === 'info',
      'bg-yellow-600': type === 'confirm',
      'opacity-0 scale-95 pointer-events-none': !visible,
      'opacity-100 scale-100': visible,
    },
  );

  return (
    <div role="alert" aria-live="assertive" className={baseClasses}>
      <div className="flex w-full items-start gap-2">
        <FlashIcon type={type} />
        <span className="flex-1 text-left">{message}</span>
      </div>
      <FlashActions
        type={type}
        action={action}
        onClose={handleClose}
        onConfirm={type === 'confirm' ? resolveConfirm : undefined}
      />
    </div>
  );
}
