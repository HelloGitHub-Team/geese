// components/LanguageSwitcher.tsx
import { useRouter } from 'next/router';
import { useState } from 'react';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Cookies = require('js-cookie');

type LanguageSwitchProps = {
  type?: string;
};

const LanguageSwitcher = (props: LanguageSwitchProps) => {
  const router = useRouter();
  const { locale, asPath } = router;
  const [selectedLocale, setSelectedLocale] = useState(locale);

  const changeLanguage = (language: string) => {
    Cookies.set('locale', language);
    setSelectedLocale(language);
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

  return (
    <div className='relative inline-block text-left'>
      <button
        onClick={() => changeLanguage(selectedLocale === 'zh' ? 'en' : 'zh')}
        type='button'
        className='inline-flex h-8 w-full items-center justify-center rounded-md border border-gray-300 bg-white px-2 text-sm font-medium text-gray-700 shadow-sm transition-colors duration-200 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-700'
      >
        {selectedLocale === 'zh' ? 'EN' : '中文'}
      </button>
    </div>
  );
};

export default LanguageSwitcher;
