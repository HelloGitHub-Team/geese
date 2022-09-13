import * as React from 'react';
import { IoIosArrowForward } from 'react-icons/io';

import clsxm from '@/lib/clsxm';

import UnderlineLink from '@/components/links/UnderlineLink';
import { UnstyledLinkProps } from '@/components/links/UnstyledLink';

type ArrowLinkProps<C extends React.ElementType> = {
  as?: C;
  direction?: 'left' | 'right';
} & UnstyledLinkProps &
  React.ComponentProps<C>;

export default function ArrowLink<C extends React.ElementType>({
  children,
  className,
  direction = 'right',
  as,
  ...rest
}: ArrowLinkProps<C>) {
  const Component = as || UnderlineLink;

  return (
    <Component
      {...rest}
      className={clsxm(
        'group gap-[0.25em]',
        direction === 'left' && 'flex-row-reverse',
        className
      )}
    >
      <span>{children}</span>
      <IoIosArrowForward size={16} />
    </Component>
  );
}
