import { useCallback } from 'react';
import { AiOutlineWechat } from 'react-icons/ai';
import { IoLogoGithub } from 'react-icons/io';

import log from '@/lib/log';

import Button from '@/components/buttons/Button';

import { getOAuthURL } from '@/services/login';

import { LoginModal } from '../user/Login';

export function GitHubButton() {
  const githubLogin = useCallback(async () => {
    try {
      const { url } = await getOAuthURL('github');
      console.log(url);
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      log.error(err);
    }
  }, []);

  return (
    <Button
      className='font-normal text-current hover:bg-transparent dark:text-gray-400 dark:hover:bg-gray-700'
      variant='white-outline'
      onClick={githubLogin}
    >
      <IoLogoGithub size={18} />
      <span className='ml-2 text-sm'>通过 GitHub 登录</span>
    </Button>
  );
}

export function WechatButton() {
  const wechatLogin = useCallback(async () => {
    try {
      const { url } = await getOAuthURL('wechat');
      console.log(url);
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      log.error(err);
    }
  }, []);

  return (
    <Button
      className='font-normal text-current hover:bg-transparent dark:text-gray-400 dark:hover:bg-gray-700'
      variant='white-outline'
      onClick={wechatLogin}
    >
      <AiOutlineWechat className='text-green-500' size={18} />
      <span className='ml-2 text-sm'>通过 Wechat 登录</span>
    </Button>
  );
}

export function LoginButton() {
  return (
    <LoginModal>
      <Button
        className='font-normal text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
        style={{ minWidth: 50 }}
        variant='ghost'
      >
        登录
      </Button>
    </LoginModal>
  );
}
