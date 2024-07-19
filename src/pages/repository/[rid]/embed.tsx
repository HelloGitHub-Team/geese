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

import { claimRepo, getClaimRepoInfo } from '@/services/repository';
import { API_HOST, API_ROOT_PATH } from '@/utils/api';

const EmbedPage: NextPage = () => {
  const router = useRouter();
  const { rid } = router.query;
  const { t } = useTranslation('claim');

  const { isLogin, login, userInfo } = useLoginContext();
  const [readmeFilename, setReadmeFilename] = useState('README.md');

  const [isReady, setIsReady] = useState(false); // 状态：是否准备好
  const [isLoading, setIsLoading] = useState(false); // 状态：是否在提交中
  const [theme, setTheme] = useState<string>('neutral');
  const [svgFile, setSVGFile] = useState<string>('');
  useEffect(() => {
    if (rid) {
      const url = new URL(`${API_HOST}${API_ROOT_PATH}/widgets/recommend.svg`);
      url.searchParams.set('rid', rid as string);
      if (userInfo?.uid) {
        url.searchParams.set('claim_uid', userInfo.uid);
        setIsReady(true);
      }
      setSVGFile(url.toString());
    }
  }, [rid, userInfo]);

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

  const handleCopy = () => {
    if (!isLogin) {
      return login();
    }
    const pageURL = `https://hellogithub.com/repository/${rid}`;
    let text = '';
    if (theme == 'small') {
      text = `<a href="${pageURL}" target="_blank"><img src="${svgFile}" alt="Featured｜HelloGitHub" /></a>`;
    } else {
      text = `<a href="${pageURL}" target="_blank"><img src="${svgFile}" alt="Featured｜HelloGitHub" style="width: 250px; height: 54px;" width="250" height="54" /></a>`;
    }
    if (isReady) {
      if (copy(text)) {
        message.success(t('copy.success'));
      } else message.error(t('copy.fail'));
    } else {
      message.warn(t('copy.warning'));
    }
  };

  // 更新输入框状态的函数
  const handleInputChange = (event: any) => {
    console.log(event.target.value);
    if (event.target.value === '') {
      setReadmeFilename('README.md');
    } else {
      setReadmeFilename(event.target.value);
    }
  };

  const handleButtonSubmit = async (rid: string) => {
    if (!isLogin) {
      return login();
    }
    if (!readmeFilename.toLowerCase().includes('readme')) {
      return Message.error(t('submit.check_fail'));
    }
    const info_res = await getClaimRepoInfo(rid);
    if (!info_res.success) {
      return Message.error(t('submit.check_fail2'));
    }
    if (info_res.data.is_claimed) {
      return Message.error(t('submit.check_fail3'));
    }
    const urlToCheck = `https://api.github.com/repos/${info_res.data.full_name}/contents/${readmeFilename}`;
    setIsLoading(true); // 设置加载状态为 true，禁用按钮
    // 发送GET请求到URL
    fetch(urlToCheck)
      .then((response) => response.json())
      .then(async (data) => {
        const base64EncodedString = data.content;
        const decodedString = Buffer.from(
          base64EncodedString,
          'base64'
        ).toString('utf8');
        // 检查响应的字段
        if (
          decodedString.includes(`https://hellogithub.com/repository/${rid}`) &&
          decodedString.includes(userInfo?.uid as string)
        ) {
          // 如果响应包含字段，发送POST请求到后台
          const res = await claimRepo(rid, readmeFilename);
          if (res.success) {
            return Message.success(t('submit.success'));
          } else {
            return Message.error(res.message as string);
          }
        } else {
          return Message.error(t('submit.fail'));
        }
      })
      .catch(() => {
        return Message.error(t('submit.fail2'));
      })
      .finally(() => {
        setIsLoading(false); // 设置加载状态为 false，启用按钮
      });
  };

  return (
    <>
      <Seo title={t('title')} description={t('description')} />
      <div className='relative pb-6'>
        <Navbar middleText={t('navbar')} />
        <div className='my-2 bg-white px-4 py-2 dark:bg-gray-800 md:rounded-lg'>
          <div className='mt-2'>
            <h2 className='mb-4 text-center text-2xl font-semibold'>
              {t('top_h2')}
            </h2>
            <p className='mb-4 text-gray-700 dark:text-gray-200'>
              <Trans ns='claim' i18nKey='top_text' />
            </p>
            <div className='mb-4 flex flex-col rounded-lg bg-gray-100 dark:bg-gray-700'>
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
                <div className='shrink grow'></div>
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
                  <img className='w-max-full items-center' src={svgFile} />
                ) : (
                  <Loading />
                )}
              </div>
            </div>
            <div className='mx-auto mb-6 max-w-4xl text-left'>
              <ul className='ml-6 list-disc'>
                <li className='mb-2'>
                  <Trans ns='claim' i18nKey='rights.item1' />
                </li>
                <li className='mb-2'>
                  <Trans ns='claim' i18nKey='rights.item2' />
                </li>
                <li className='mb-2'>
                  <Trans ns='claim' i18nKey='rights.item3' />
                </li>
                <li className='mb-2'>
                  <Trans ns='claim' i18nKey='rights.item4' />
                </li>
                <li className='mb-2'>
                  <Trans ns='claim' i18nKey='rights.item5' />
                </li>
              </ul>
            </div>
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
                        onClick={() => handleButtonSubmit(rid as string)}
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
            <div className='mx-auto max-w-4xl text-left'>
              <h3 className='mb-4 text-lg font-medium'>
                {t('question.title')}
              </h3>
              <ul className='ml-6 list-disc space-y-2'>
                <li>
                  <Trans ns='claim' i18nKey='question.item1' />
                </li>
                <li>
                  <Trans ns='claim' i18nKey='question.item2' />
                </li>
                <li>
                  <Trans ns='claim' i18nKey='question.item3' />
                </li>
                <li>
                  <Trans ns='claim' i18nKey='question.item4' />
                </li>
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
