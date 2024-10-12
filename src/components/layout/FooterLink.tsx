import * as React from 'react';

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const FooterLink: React.FC<FooterLinkProps> = ({
  href,
  children,
  className = '',
}) => {
  return (
    // eslint-disable-next-line react/jsx-no-target-blank
    <a
      className={`cursor-pointer hover:text-blue-500 ${className}`}
      target='_blank'
      href={href}
      aria-label='footer-link'
    >
      {children}
    </a>
  );
};

export default FooterLink;
