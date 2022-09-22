import { useRouter } from 'next/router';
import { AiOutlineTrophy } from 'react-icons/ai';

import { getPeriodicalPath } from '@/components/buttons/Periodical';
import type { option } from '@/components/dropdown/Dropdown';
import Dropdown from '@/components/dropdown/Dropdown';

import Button from './Button';

type RankButtonProps = {
  type?: '' | 'dropdown';
};

const btnList: option[] = [
  { key: '/', value: '首页' },
  { key: 'periodical', value: '月刊' },
  { key: '/report/tiobe', value: '排行榜' },
];

export const RankButton = (props: RankButtonProps) => {
  const router = useRouter();
  const onChange = async (opt: option) => {
    if (opt.key === 'periodical') {
      const path = await getPeriodicalPath();
      router.push(path);
    } else {
      router.push(opt.key as any);
    }
  };

  if (props.type === 'dropdown') {
    let key = '/';
    if (router.isReady) {
      if (router.pathname.includes('periodical')) {
        key = 'periodical';
      } else if (router.pathname.includes('report')) {
        key = '/report/tiobe';
      }
    }
    return (
      <Dropdown
        initValue={key}
        size='medium'
        border={false}
        options={btnList}
        onChange={(opt) => onChange(opt)}
      />
    );
  }

  return (
    <Button
      className='font-normal text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
      variant='ghost'
      onClick={() => {
        router.push('/report/tiobe');
      }}
    >
      <AiOutlineTrophy className='mr-0.5' />
      排行榜
    </Button>
  );
};
