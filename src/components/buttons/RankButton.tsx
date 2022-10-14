import { useRouter } from 'next/router';
import { AiOutlineTrophy } from 'react-icons/ai';

import type { option } from '@/components/dropdown/Dropdown';
import Dropdown from '@/components/dropdown/Dropdown';

import Button from './Button';

type RankButtonProps = {
  type?: '' | 'dropdown';
};

const btnList: option[] = [
  { key: '/', value: '首页' },
  { key: '/periodical/volume', value: '月刊' },
  { key: '/report/tiobe', value: '排行榜' },
  { key: '/article', value: '文章' },
];

const RankButton = (props: RankButtonProps) => {
  const router = useRouter();
  const onChange = async (opt: option) => {
    router.push(opt.key as any);
  };

  if (props.type === 'dropdown') {
    let key = '/';
    if (router.isReady) {
      if (router.pathname.includes('periodical')) {
        key = '/periodical/volume';
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
    <Button
      className='font-normal text-gray-500 hover:bg-transparent hover:text-blue-500 dark:text-gray-400 dark:hover:bg-gray-700'
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

export default RankButton;
