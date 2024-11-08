import React from 'react';

import { NoPrefetchLink } from '@/components/links/CustomLink';

interface EmptyStateyProps {
  message: string;
}

export const EmptyState: React.FC<EmptyStateyProps> = ({ message }) => {
  return (
    <div className='mt-4 text-center text-xl'>
      <div className='py-14 text-gray-300 dark:text-gray-500'>{message}</div>
    </div>
  );
};

export const Divider = () => <div className='mx-1'>·</div>;

type LevelNames = {
  zh: string[];
  en: string[];
};

export const LevelRender = (level: number, showLevel = true, locale = 'zh') => {
  const levelNames: LevelNames = {
    zh: [
      '社区新人',
      '活跃讨论者',
      '优质贡献者',
      '社区达人',
      '分享专家',
      '社区领袖',
    ],
    en: ['Newbie', 'Discusser', 'Contributor', 'Expert', 'Master', 'Leader'],
  };

  const levelStyles = {
    1: 'text-gray-600',
    2: 'text-blue-500',
    3: 'text-green-500',
    4: 'text-purple-500',
    5: 'text-yellow-500',
    6: 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500',
  };

  const getLevelClass = (level: number) => {
    const baseStyle = levelStyles[level as keyof typeof levelStyles];
    const commonClasses = 'flex i items-baseline gap-1 cursor-pointer';
    return `${commonClasses} ${baseStyle} transition-colors`;
  };

  const currentLang = locale === 'zh' ? 'zh' : 'en';

  return (
    <NoPrefetchLink href='/help/level'>
      <div className={getLevelClass(level)}>
        {showLevel && <span className='font-medium'>Lv.{level}</span>}
        <span className='text-xs opacity-60'>
          {levelNames[currentLang][level - 1]}
        </span>
      </div>
    </NoPrefetchLink>
  );
};
