import { useRouter } from 'next/router';
import { TouchEvent, useEffect, useRef, useState } from 'react';

const ease = (distance: number) => {
  return distance / 2;
};

const PullRefresh = ({ children }: { children?: JSX.Element }) => {
  const [height, setHeight] = useState(0);
  const [isRefresh, setIsRefresh] = useState(false);
  const [startY, setStartY] = useState(0);
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const el = useRef<HTMLDivElement>(null);
  const route = useRouter();

  const handleTouchStart = (e: TouchEvent) => {
    const top = e.currentTarget.getBoundingClientRect().top;
    setStartY(e.touches[0].pageY - top);
    setHeight(0);
    setIsRefresh(false);
    setShouldRefresh(false);
  };
  const handleTouchMove = (e: TouchEvent) => {
    const touch = e.touches[0];
    const moveY = touch.pageY - startY;
    const top = e.currentTarget.getBoundingClientRect().top;

    if (top === 0 && moveY > 0) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      e.preventDefault();
      setHeight(ease(moveY));
      if (ease(moveY) > 80) {
        setShouldRefresh(true);
      } else {
        setShouldRefresh(false);
      }
    }
  };
  const handleTouchEnd = () => {
    document.documentElement.style.overflow = 'initial';
    document.body.style.overflow = 'initial';
    if (shouldRefresh) {
      setHeight(50);
      setIsRefresh(true);
      route.reload();
    } else {
      setHeight(0);
    }
    setShouldRefresh(false);
  };

  useEffect(() => {
    const elCurrent = el.current;
    elCurrent?.addEventListener('touchstart', handleTouchStart as any, {
      passive: false,
    });
    elCurrent?.addEventListener('touchmove', handleTouchMove as any, {
      passive: false,
    });
    elCurrent?.addEventListener('touchend', handleTouchEnd as any, {
      passive: false,
    });
    elCurrent?.addEventListener('touchcancel', handleTouchEnd as any, {
      passive: false,
    });

    return () => {
      elCurrent?.removeEventListener('touchstart', handleTouchStart as any);
      elCurrent?.removeEventListener('touchmove', handleTouchMove as any);
      elCurrent?.removeEventListener('touchend', handleTouchEnd as any);
      elCurrent?.removeEventListener('touchcancel', handleTouchEnd as any);
    };
  });

  return (
    <div ref={el}>
      <div
        style={{ height }}
        className='flex items-center justify-center overflow-hidden text-sm text-slate-800 dark:text-slate-300'
      >
        {shouldRefresh ? '松开刷新' : isRefresh ? '刷新中...' : '下拉刷新'}
      </div>
      {children}
    </div>
  );
};

export default PullRefresh;
