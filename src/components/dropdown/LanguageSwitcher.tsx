// components/LanguageSwitcher.tsx
import { useRouter } from 'next/router';
import { useState } from 'react';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Cookies = require('js-cookie');

type LanguageSwitchProps = {
  type?: string;
};

type Language = {
  code: string;
  text: string;
  fullText: string;
};

const LANGUAGES: Language[] = [
  { code: 'zh', text: '中文', fullText: '简体中文' },
  { code: 'en', text: 'EN', fullText: 'English' },
  { code: 'ja', text: 'JP', fullText: '日本語' },
];

const LanguageSwitcher = (props: LanguageSwitchProps) => {
  const router = useRouter();
  const { locale, asPath } = router;
  const [selectedLocale, setSelectedLocale] = useState(locale);
  const [isOpen, setIsOpen] = useState(false);

  const changeLanguage = (language: string) => {
    Cookies.set('locale', language);
    setSelectedLocale(language);
    setIsOpen(false);
    router.push(asPath, asPath, { locale: language });
  };

  const getCurrentLanguage = () => {
    return LANGUAGES.find(lang => lang.code === locale) ?? LANGUAGES[0];
  };

  if (props.type === 'text') {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
        >
          {getCurrentLanguage().fullText}
        </button>
        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
            <div className="py-1" role="menu">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    locale === lang.code
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  role="menuitem"
                >
                  {lang.fullText}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className="inline-flex h-8 w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 shadow-sm transition-colors duration-200 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-700"
      >
        {getCurrentLanguage().text}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  locale === lang.code
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                role="menuitem"
              >
                {lang.text}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
