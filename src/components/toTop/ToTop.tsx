import * as React from 'react';

interface ToTopProps {
  cb?: () => void;
}
/**
 * 回到顶部
 */
export default function ToTop({ cb }: ToTopProps) {
  const [show, setShow] = React.useState(false);
  const ticking = React.useRef(false);

  const onToTop = () => {
    window.scrollTo({ top: 0 });
    cb?.();
  };

  // 监听 body 滚动事件, 滚动到指定高度时显示回到顶部按钮
  React.useEffect(() => {
    window.addEventListener('scroll', (e: Event) => {
      if (!ticking.current) {
        window.requestAnimationFrame(function () {
          const top = (e.target as any).documentElement.scrollTop || 0;
          setShow(top > 300);
          ticking.current = false;
        });
        ticking.current = true;
      }
    });
  }, [show]);

  return (
    <div
      onClick={onToTop}
      style={show ? { display: 'flex' } : { display: 'none' }}
      className='fixed bottom-10 right-10 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white shadow-sm hover:shadow-md'
    >
      <svg
        width='18'
        height='18'
        viewBox='0 0 48 48'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M24.0083 14.1006V42.0001'
          stroke='#333'
          strokeWidth='4'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M12 26L24 14L36 26'
          stroke='#333'
          strokeWidth='4'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M12 6H36'
          stroke='#333'
          strokeWidth='4'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    </div>
  );
}
