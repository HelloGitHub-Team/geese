import { useEffect } from 'react';

import { toggleTheme, updateTheme } from '@/lib/theme';
import { useLoginContext } from '@/hooks/useLoginContext';

import { TranslationFunction } from '@/types/utils';

type ThemeSwitchProps = {
  t?: TranslationFunction;
  type?: string;
};

const ThemeSwitcher: React.FC<ThemeSwitchProps> = (props: ThemeSwitchProps) => {
  const { theme, changeTheme } = useLoginContext();

  useEffect(() => {
    updateTheme();
  }, []);

  const onToggle = () => {
    const newTheme = toggleTheme();
    changeTheme(newTheme);
  };

  if (props.type === 'text' && props.t) {
    return (
      <span onClick={onToggle}>
        {theme === 'light' ? props.t('theme.dark') : props.t('theme.light')}
      </span>
    );
  }

  return (
    <button
      type='button'
      onClick={onToggle}
      className='rounded-md p-2 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700'
      aria-label='Toggle theme'
    >
      {theme == 'light' ? (
        <svg
          className='h-4 w-4'
          data-testid='geist-icon'
          fill='none'
          shapeRendering='geometricPrecision'
          stroke='currentColor'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='1.5'
          viewBox='0 0 24 24'
        >
          <circle cx='12' cy='12' r='5'></circle>
          <path d='M12 1v2'></path>
          <path d='M12 21v2'></path>
          <path d='M4.22 4.22l1.42 1.42'></path>
          <path d='M18.36 18.36l1.42 1.42'></path>
          <path d='M1 12h2'></path>
          <path d='M21 12h2'></path>
          <path d='M4.22 19.78l1.42-1.42'></path>
          <path d='M18.36 5.64l1.42-1.42'></path>
        </svg>
      ) : (
        <svg
          className='h-4 w-4'
          data-testid='geist-icon'
          fill='none'
          shapeRendering='geometricPrecision'
          stroke='currentColor'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='1.5'
          viewBox='0 0 24 24'
        >
          <path d='M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z'></path>
        </svg>
      )}
    </button>
  );
};

export default ThemeSwitcher;
