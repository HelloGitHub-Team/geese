import { IoIosArrowForward } from 'react-icons/io';

import LanguageSwitcher from '@/components/buttons/LanguageSwitcher';
import ThemeSwitcher from '@/components/buttons/ThemeSwitcher';
import { NoPrefetchLink } from '@/components/links/CustomLink';

type Props = {
  httpCode: number;
  t: (key: string) => string;
};

const ErrorPage = ({ t, httpCode }: Props) => {
  return (
    <main>
      <div className='hidden'>
        <ThemeSwitcher />
        <LanguageSwitcher />
      </div>
      <section className='min-h-screen bg-white dark:bg-gray-800'>
        <div className='flex flex-col items-center justify-center'>
          <div className='mx-4 mt-14 mb-2'>
            <img
              src={`https://img.hellogithub.com/svg/${httpCode}.svg`}
              width={500}
            />
          </div>
          <NoPrefetchLink href='/'>
            <a>
              <div className='group relative inline-flex cursor-pointer items-center overflow-hidden rounded border border-current px-7 py-2 text-blue-600 focus:outline-none focus:ring active:text-blue-500 dark:text-gray-500 dark:active:text-gray-500'>
                <span className='absolute right-0 translate-x-full transition-transform group-hover:-translate-x-4'>
                  <IoIosArrowForward size={16} />
                </span>

                <span className='text-sm font-medium transition-all group-hover:mr-4'>
                  <span>{t('return')}</span>
                </span>
              </div>
            </a>
          </NoPrefetchLink>
          <div className='mt-4 block text-xs text-gray-400'>
            <NoPrefetchLink href='mailto:595666367@qq.com'>
              <a
                target='_blank'
                className='cursor-pointer hover:underline'
                rel='noreferrer'
              >
                <span>{t('footer.feedback')}</span>
              </a>
            </NoPrefetchLink>
            <span className='px-1'>·</span>
            <NoPrefetchLink href='https://github.com/HelloGitHub-Team/geese'>
              <a
                target='_blank'
                className='cursor-pointer hover:underline'
                rel='noreferrer'
              >
                <span>{t('footer.source')}</span>
              </a>
            </NoPrefetchLink>

            <p className='mt-2'>
              <span className='cursor-default'>
                ©{new Date().getFullYear()} HelloGitHub
              </span>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ErrorPage;
