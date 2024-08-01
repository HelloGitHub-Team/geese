import { useRouter } from 'next/router';

import HeaderBtn from '@/components/buttons/HeaderBtn';
import type { option } from '@/components/dropdown/Dropdown';
import Dropdown from '@/components/dropdown/Dropdown';

import { TranslationFunction } from '@/types/utils';

type RankButtonProps = {
  t: TranslationFunction;
  type?: '' | 'dropdown';
};

const RankButton = ({ t, type = '' }: RankButtonProps) => {
  const router = useRouter();

  const btnList: option[] = [
    { key: '/', value: t('header.home') },
    { key: '/periodical', value: t('header.periodical') },
    { key: '/report/tiobe', value: t('header.rank') },
    { key: '/article', value: t('header.article') },
    { key: '/onefile', value: 'OneFile' },
  ];

  const onChange = async (opt: option) => {
    router.push(opt.key as any);
  };

  if (type === 'dropdown') {
    let key = '/';
    if (router.isReady) {
      if (router.pathname.includes('periodical')) {
        key = '/periodical';
      } else if (router.pathname.includes('report')) {
        key = '/report/tiobe';
      } else if (router.pathname.includes('article')) {
        key = '/article';
      }
    }
    return (
      <Dropdown
        initValue={key}
        border={false}
        options={btnList}
        minWidth={76}
        onChange={(opt) => onChange(opt)}
      />
    );
  }

  return (
    <HeaderBtn pathname='/report/tiobe'>
      <span className='mr-0.5'>🏆</span>
      <span>{t('header.rank')}</span>
    </HeaderBtn>
  );
};

export default RankButton;
