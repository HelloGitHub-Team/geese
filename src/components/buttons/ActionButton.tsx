import React, { MouseEventHandler, ReactNode } from 'react';

interface ActionButtonProps {
  icon: ReactNode;
  text: ReactNode;
  className?: string;
  onClick: MouseEventHandler<HTMLSpanElement>;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  text,
  className = '',
  onClick,
}) => (
  <span
    className={`inline-flex items-center hover:text-blue-400 ${className}`}
    onClick={onClick}
  >
    {icon}
    {text}
  </span>
);

export default ActionButton;
