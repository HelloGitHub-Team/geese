import Link from 'next/link';
import { useEffect, useState } from 'react';

import clsxm from '@/lib/clsxm';

type Props = {
  href: string;
  prefetch?: boolean;
} & React.ComponentPropsWithoutRef<'a'>;

export const CustomLink = ({ href, className, children, ...props }: Props) => {
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
    <Link
      {...props}
      prefetch={false}
      href={href}
      target={isMobile ? '_self' : '_blank'}
      className={clsxm('block', className)}
    >
      {children}
    </Link>
  );
};

export const NoPrefetchLink = ({ href, children, ...props }: Props) => {
  return (
    <Link {...props} prefetch={false} href={href}>
      {children}
    </Link>
  );
};
