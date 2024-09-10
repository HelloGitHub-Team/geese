import { useRouter } from 'next/router';
import { AiOutlineArrowLeft } from 'react-icons/ai';

import { NoPrefetchLink } from '@/components/links/CustomLink';

interface Props {
  avatar: string;
  uid: string;
  t: (key: string) => string;
}

const RepoDetailNavbar = ({ avatar, uid, t }: Props) => {
  const router = useRouter();

  const goBack = () => {
    if (window.history.length < 2) {
      router.push('/');
    } else {
      router.back();
    }
  };

  return (
    <div className='my-2 bg-white dark:bg-gray-800 md:rounded-lg'>
      <div className='flex h-12 items-center justify-between py-2 px-4'>
        <div className='cursor-pointer pr-4' onClick={goBack}>
          <AiOutlineArrowLeft
            className='text-gray-500 hover:text-blue-400'
            size={18}
          />
        </div>
        <div className='text-center font-bold dark:text-gray-300'>
          {t('nav.title')}
        </div>
        <NoPrefetchLink href={`/user/${uid}`}>
          <div className='flex cursor-pointer items-center justify-end text-xs text-gray-500 hover:text-blue-400 dark:text-gray-400'>
            {t('nav.desc')}
            <span className='m-1 flex items-center'>
              <img
                className='rounded-full hover:animate-spin'
                src={avatar}
                width='18'
                height='18'
                alt='navbar_avatar'
              />
            </span>
            {t('nav.desc2')}
          </div>
        </NoPrefetchLink>
      </div>
    </div>
  );
};

export default RepoDetailNavbar;
