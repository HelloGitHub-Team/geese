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
    <a
      className={`cursor-pointer hover:text-blue-500 ${className}`}
      target='_blank'
      href={href}
      rel='noreferrer'
    >
      {children}
    </a>
  );
};

export default FooterLink;
