import { useCallback, useState } from 'react';
import { AiOutlineWechat } from 'react-icons/ai';
import { IoLogoGithub } from 'react-icons/io';

import log from '@/lib/log';

import Button from '@/components/buttons/Button';

import { getOAuthURL } from '@/services/login';
import { OAUTH_LOGIN_KEY } from '@/utils/constants';

import { LoginModal } from '../user/Login';

import { TranslationFunction } from '@/types/utils';

type Props = {
  platform: 'GitHub' | 'WeChat';
  backURL: string;
  t: TranslationFunction;
};

export function OAuthButton({ platform, backURL, t }: Props) {
  const [buttonState, setButtonState] = useState(true);
  const [buttonText, setButtonText] = useState(
    t('login.oauth', { platform: platform })
  );

  const Login = useCallback(async () => {
    try {
      setButtonState(false);
      const { url } = await getOAuthURL(platform);
      if (url) {
        localStorage.setItem(OAUTH_LOGIN_KEY, backURL);
        setButtonText(t('login.redirect'));
        window.location.href = url;
      }
    } catch (err) {
      log.error(err);
    }
  }, [platform, backURL]);

  const getIcon = () => {
    if (platform == 'GitHub') {
      return <IoLogoGithub size={18} />;
    } else {
      return <AiOutlineWechat className='text-green-500' size={18} />;
    }
  };

  return (
    <Button
      className='font-normal text-current hover:bg-transparent dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-800'
      variant='white-outline'
      disabled={!buttonState}
      onClick={Login}
    >
      {getIcon()}
      <span className='ml-2 text-sm'>{buttonText}</span>
    </Button>
  );
}

type LoginButtonProps = {
  t: (key: string) => string;
};

export const LoginButton = ({ t }: LoginButtonProps) => {
  return (
    <LoginModal>
      <Button
        className='font-normal text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
        style={{ minWidth: 50 }}
        variant='ghost'
      >
        {t('login.text')}
      </Button>
    </LoginModal>
  );
};
