import Link from 'next/link';
import { useEffect, useState } from 'react';

import clsxm from '@/lib/clsxm';

type Props = {
  href: string;
  prefetch?: boolean;
  onClick?: any;
} & React.ComponentPropsWithoutRef<'div'>;

export const CustomLink = ({ href, className, children, onClick }: Props) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  useEffect(() => {
    if (
      navigator.userAgent.match(/Mobi/i) ||
      navigator.userAgent.match(/Android/i) ||
      navigator.userAgent.match(/iPhone/i)
    ) {
      setIsMobile(true);
    }
  }, [setIsMobile]);

  return (
    <Link prefetch={false} href={href}>
      <a
        onClick={onClick}
        target={isMobile ? '_self' : '_blank'}
        className={clsxm('block', className)}
      >
        {children}
      </a>
    </Link>
  );
};

export const NoPrefetchLink = ({ href, children }: Props) => {
  return (
    <Link prefetch={false} href={href}>
      {children}
    </Link>
  );
};
