// components/LanguageSwitcher.tsx
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

type LanguageSwitchProps = {
  type?: string;
};

const LanguageSwitcher = (props: LanguageSwitchProps) => {
  const router = useRouter();
  const { locale, asPath } = router;
  const [selectedLocale, setSelectedLocale] = useState(locale);
  const [isHovered, setIsHovered] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const storedLocale = localStorage.getItem('locale');
    if (storedLocale) {
      setSelectedLocale(storedLocale);
      router.push(asPath, asPath, { locale: storedLocale });
    } else {
      const systemLocale = navigator.language.toLowerCase().startsWith('zh')
        ? 'zh'
        : 'en';
      setSelectedLocale(systemLocale);
      localStorage.setItem('locale', systemLocale);
      router.push(asPath, asPath, { locale: systemLocale });
    }
  }, []);

  const changeLanguage = (language: string) => {
    localStorage.setItem('locale', language);
    setSelectedLocale(language);
    setIsHovered(false);
    router.push(asPath, asPath, { locale: language });
  };

  if (props.type === 'text') {
    const isChinese = locale == 'zh' ? true : false;
    const buttonText = isChinese ? 'English' : '简体中文';
    return (
      <span onClick={() => changeLanguage(isChinese ? 'en' : 'zh')}>
        {buttonText}
      </span>
    );
  }

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 300);
  };

  return (
    <div
      className='relative inline-block text-left'
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div>
        <button
          type='button'
          className='inline-flex h-8 w-full items-center justify-center rounded-md border border-gray-300 bg-white px-2 text-sm font-medium text-gray-700 shadow-sm transition-colors duration-200 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-700'
          id='options-menu'
          aria-haspopup='true'
          aria-expanded={isHovered ? 'true' : 'false'}
        >
          {selectedLocale === 'zh' ? '中文' : 'EN'}
        </button>
      </div>

      {isHovered && (
        <div
          className='absolute right-0 mt-2 w-[110px] origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-600'
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className='py-1'
            role='menu'
            aria-orientation='vertical'
            aria-labelledby='options-menu'
          >
            <button
              onClick={() => changeLanguage('zh')}
              className='block w-full px-4 py-2 text-left text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              role='menuitem'
            >
              🇨🇳 中文
            </button>
            <button
              onClick={() => changeLanguage('en')}
              className='block w-full px-4 py-2 text-left text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              role='menuitem'
            >
              🇺🇸 English
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
