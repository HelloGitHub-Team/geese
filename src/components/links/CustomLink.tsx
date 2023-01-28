import Link from 'next/link';
import { useEffect, useState } from 'react';

import clsxm from '@/lib/clsxm';

type Props = {
  href: string;
  onClick?: any;
} & React.ComponentPropsWithoutRef<'div'>;

const CustomLink = ({ href, className, children, onClick }: Props) => {
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
    <Link href={href}>
      <a
        onClick={onClick}
        target={isMobile ? '_self' : '_blank'}
        className={clsxm('block', className)}
        rel='noopener noreferrer'
      >
        {children}
      </a>
    </Link>
  );
};

export default CustomLink;
