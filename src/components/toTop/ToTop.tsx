import * as React from 'react';
import { IoIosArrowRoundUp } from 'react-icons/io';

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
    const handleScroll = (e: Event) => {
      if (!ticking.current) {
        window.requestAnimationFrame(function () {
          const top = (e.target as any).documentElement.scrollTop || 0;
          setShow(top > 300);
          ticking.current = false;
        });
        ticking.current = true;
      }
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [show]);

  return (
    <div
      onClick={onToTop}
      style={show ? { display: 'flex' } : { display: 'none' }}
      className='z-99 fixed bottom-10 right-10 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white shadow-sm hover:shadow-md dark:bg-gray-800 dark:text-slate-300'
    >
      <IoIosArrowRoundUp size={22} />
    </div>
  );
}
