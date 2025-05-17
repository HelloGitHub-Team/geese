import classNames from 'classnames';
import copy from 'copy-to-clipboard';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { Trans, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useState } from 'react';

import { useLoginContext } from '@/hooks/useLoginContext';

import Button from '@/components/buttons/Button';
import Loading from '@/components/loading/Loading';
import message from '@/components/message';
import Message from '@/components/message';
import Navbar from '@/components/navbar/Navbar';
import Seo from '@/components/Seo';

import { claimRepo, getClaimInfo } from '@/services/repository';
import { API_HOST, API_ROOT_PATH } from '@/utils/api';

const EmbedPage: NextPage = () => {
  const router = useRouter();
  const { rid } = router.query;
  const { t } = useTranslation('claim');

  const [url, setUrl] = useState('');
  const [repoID, setRepoID] = useState<string>(rid as string);
  const { isLogin, login, userInfo } = useLoginContext();
  const [readmeFilename, setReadmeFilename] = useState('README.md');
  const [isReady, setIsReady] = useState(false); // 状态：是否准备好
  const [isLoading, setIsLoading] = useState(false); // 状态：是否在提交中
  const [theme, setTheme] = useState<string>('neutral');
  const [svgFile, setSVGFile] = useState<string>('');

  const generateBadge = () => {
    if (!repoID) return;
    const url = new URL(`${API_HOST}${API_ROOT_PATH}/widgets/recommend.svg`);
    url.searchParams.set('rid', repoID);
    if (userInfo?.uid) {
      url.searchParams.set('claim_uid', userInfo.uid);
      setIsReady(true);
    }
    setSVGFile(url.toString());
  };

  useEffect(() => {
    if (rid) setRepoID(rid as string);
  }, [rid]);

  useEffect(() => {
    if (repoID) generateBadge();
  }, [repoID, userInfo]);

  const themeClassName = (themeName: string) =>
    classNames('px-2 py-1 text-xs', {
      'rounded-md': theme !== themeName,
      'text-white bg-blue-500 rounded-full': theme === themeName,
    });

  const handleTheme = (themeName: string) => {
    setTheme(themeName);
    if (svgFile) {
      const url = new URL(svgFile);
      url.searchParams.set('theme', themeName);
      setSVGFile(url.toString());
    }
  };

  const handleGenerate = async () => {
    const info_res = await getClaimInfo(null, url);
    if (!info_res.success) return Message.error(t('submit.check_fail2'));
    switch (info_res.data.status) {
      case 1:
        return Message.error(t('submit.check_fail3'));
      case 2:
        return Message.error(t('submit.check_fail4'));
      case 3:
        setRepoID(info_res.data.rid);
        break;
      case 4:
        return Message.error(t('submit.check_fail5'));
      case 5:
        return Message.error(t('submit.check_fail6'));
    }
  };

  const handleCopy = () => {
    if (!isLogin) return login();
    const pageURL = `https://hellogithub.com/repository/${repoID}`;
    const text =
      theme === 'small'
        ? `<a href="${pageURL}" target="_blank"><img src="${svgFile}" alt="Featured｜HelloGitHub" /></a>`
        : `<a href="${pageURL}" target="_blank"><img src="${svgFile}" alt="Featured｜HelloGitHub" style="width: 250px; height: 54px;" width="250" height="54" /></a>`;
    if (isReady) {
      copy(text)
        ? message.success(t('copy.success'))
        : message.error(t('copy.fail'));
    } else {
      message.warn(t('copy.warning'));
    }
  };

  // 更新输入框状态的函数
  const handleInputChange = (event: any) => {
    setReadmeFilename(event.target.value || 'README.md');
  };

  const handleButtonSubmit = async () => {
    if (!isLogin) return login();
    if (!readmeFilename.toLowerCase().includes('readme'))
      return Message.error(t('submit.check_fail'));

    const info_res = await getClaimInfo(repoID, null);
    if (!info_res.success) return Message.error(t('submit.check_fail2'));

    switch (info_res.data.status) {
      case 1:
        return Message.error(t('submit.check_fail3'));
      case 2:
        return Message.error(t('submit.check_fail4'));
      case 4:
        return Message.error(t('submit.check_fail5'));
      case 5:
        return Message.error(t('submit.check_fail6'));
    }
    try {
      setIsLoading(true);
      const res = await claimRepo(
        repoID,
        readmeFilename,
        info_res.data.full_name
      );
      if (res.success) {
        return Message.success(t('submit.success'));
      } else {
        return Message.error(res.message as string);
      }
    } catch (error) {
      return Message.error(t('submit.fail'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Seo title={t('title')} description={t('description')} />
      <div className='relative pb-6'>
        <Navbar middleText={t('navbar')} />
        <div className='my-2 bg-white px-4 py-2 dark:bg-gray-800 md:rounded-lg'>
          <div className='mt-2'>
            <img
              className='w-max-full'
              src='https://img.hellogithub.com/logo/badge_head.png'
              alt='badge_head'
            />
            <p className='my-4 text-gray-700 dark:text-gray-200'>
              <Trans ns='claim' i18nKey='top_text' />
            </p>
            <div className='mx-auto mb-6 max-w-4xl text-left'>
              <ul className='ml-6 list-disc'>
                {['item1', 'item2', 'item3', 'item4', 'item5'].map(
                  (item, idx) => (
                    <li key={idx} className='mb-2'>
                      <Trans ns='claim' i18nKey={`rights.${item}`} />
                    </li>
                  )
                )}
              </ul>
            </div>

            <div className='mb-6'>
              <h3 className='mb-4 text-lg font-medium'>
                {t('generate.title')}
              </h3>
              {repoID ? (
                <div className='flex flex-col rounded-lg bg-gray-100 dark:bg-gray-700'>
                  <div className='flex rounded-t-lg bg-gray-200 dark:bg-slate-900'>
                    <div className='p-2'>
                      <div className='flex cursor-pointer rounded-full bg-gray-50 dark:bg-gray-600'>
                        <div
                          className={themeClassName('neutral')}
                          onClick={() => handleTheme('neutral')}
                        >
                          {t('badge_theme_neutral')}
                        </div>
                        <div
                          className={themeClassName('dark')}
                          onClick={() => handleTheme('dark')}
                        >
                          {t('badge_theme_dark')}
                        </div>
                        <div
                          className={themeClassName('small')}
                          onClick={() => handleTheme('small')}
                        >
                          {t('badge_theme_small')}
                        </div>
                      </div>
                    </div>
                    <div className='shrink grow' />
                    <div className='p-1.5'>
                      <Button
                        onClick={handleCopy}
                        className='cursor-pointer rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-600'
                      >
                        {t('copy.text')}
                      </Button>
                    </div>
                  </div>

                  <div className='my-8 flex justify-center'>
                    {svgFile ? (
                      <img className='w-max-full' src={svgFile} />
                    ) : (
                      <Loading />
                    )}
                  </div>
                </div>
              ) : (
                <div className='flex items-center space-x-4 rounded-lg bg-gray-100 p-4 dark:bg-gray-700'>
                  <input
                    type='text'
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder={t('generate.placeholder')}
                    className='flex-1 rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                  />
                  <Button
                    onClick={() => handleGenerate()}
                    className='w-auto rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700'
                  >
                    {t('generate.button')}
                  </Button>
                </div>
              )}
            </div>

            {repoID && (
              <div className='mx-auto mb-6 max-w-4xl text-left'>
                <h3 className='mb-4 text-lg font-medium'>{t('howto.title')}</h3>
                <ol className='ml-6 list-decimal'>
                  <li className='mb-4'>
                    <div className='flex flex-wrap items-center'>
                      <span>{t('howto.step1')}</span>
                      <div
                        onClick={handleCopy}
                        className='cursor-pointer rounded-md bg-gray-100 px-2 py-1 text-sm font-medium dark:bg-gray-700 dark:text-white md:mx-2'
                      >
                        {t('copy.text')}
                      </div>
                    </div>
                  </li>
                  <li className='mb-4'>
                    <Trans ns='claim' i18nKey='howto.step2' />
                  </li>
                  <li className='mb-4'>
                    <div className='flex items-center'>
                      <div className='w-fit'>
                        <span>{t('howto.step3')}</span>
                        <input
                          onChange={handleInputChange}
                          type='text'
                          className='ml-2 mt-1 max-w-[140px] flex-grow rounded-md border border-gray-300 bg-white px-2 py-1 text-sm placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-500 dark:text-gray-500 md:mt-0 md:px-3 md:py-1 md:text-base'
                          placeholder='README.md'
                        />
                        <Button
                          onClick={() => handleButtonSubmit()}
                          className='ml-2 py-1'
                          disabled={isLoading}
                        >
                          {isLoading ? t('submit.loding') : t('submit.text')}
                        </Button>
                      </div>
                    </div>
                  </li>
                  <li>{t('howto.step4')}</li>
                </ol>
              </div>
            )}
            <div className='mx-auto max-w-4xl text-left'>
              <h3 className='mb-4 text-lg font-medium'>
                {t('question.title')}
              </h3>

              <ul className='ml-6 list-disc space-y-2'>
                {['item1', 'item2', 'item3', 'item4', 'item5'].map(
                  (item, idx) => (
                    <li key={idx}>
                      <Trans ns='claim' i18nKey={`question.${item}`} />
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
          <div className='h-4'></div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ['common', 'claim'])),
  },
});

export default EmbedPage;
