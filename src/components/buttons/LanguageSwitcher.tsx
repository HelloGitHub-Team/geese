// components/LanguageSwitcher.tsx
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

const LanguageSwitcher = () => {
  const router = useRouter();
  const { locale, asPath } = router;
  const [selectedLocale, setSelectedLocale] = useState(locale);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedLocale = localStorage.getItem('locale');
    if (storedLocale && storedLocale !== locale) {
      setSelectedLocale(storedLocale);
      router.push(asPath, asPath, { locale: storedLocale });
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const changeLanguage = (language: string) => {
    localStorage.setItem('locale', language);
    setSelectedLocale(language);
    setIsOpen(false); // 关闭下拉菜单
    router.push(asPath, asPath, { locale: language });
  };

  return (
    <div className='relative inline-block text-left' ref={dropdownRef}>
      <div>
        <button
          type='button'
          className='inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
          id='options-menu'
          aria-haspopup='true'
          aria-expanded={isOpen ? 'true' : 'false'}
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedLocale === 'zh'
            ? '中文'
            : selectedLocale === 'en'
            ? 'English'
            : '日本語'}
          <svg
            className='-mr-1 ml-2 h-5 w-5'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 20 20'
            fill='currentColor'
            aria-hidden='true'
          >
            <path
              fillRule='evenodd'
              d='M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0l-4.25-4.25a.75.75 0 01.02-1.06z'
              clipRule='evenodd'
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className='absolute right-0 mt-2 w-28 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
          <div
            className='py-1'
            role='menu'
            aria-orientation='vertical'
            aria-labelledby='options-menu'
          >
            <button
              onClick={() => changeLanguage('zh')}
              className='block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100'
              role='menuitem'
            >
              🇨🇳 中文
            </button>
            <button
              onClick={() => changeLanguage('en')}
              className='block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100'
              role='menuitem'
            >
              🇺🇸 English
            </button>
            <button
              onClick={() => changeLanguage('ja')}
              className='block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100'
              role='menuitem'
            >
              🇯🇵 日本語
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
