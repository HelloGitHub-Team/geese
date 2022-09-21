import { useRouter } from 'next/router';

import { getPeriodicalPath } from '@/components/buttons/Periodical';
import type { option } from '@/components/dropdown/Dropdown';
import Dropdown from '@/components/dropdown/Dropdown';

import Button from './Button';

type RankButtonProps = {
  type?: 'dropdown' | '';
};

const btnList: option[] = [
  { key: '/report/tiobe', value: '排行榜' },
  { key: '/', value: '首页' },
  { key: 'periodical', value: '月刊' },
];

export const RankButton = (props: RankButtonProps) => {
  const router = useRouter();
  const onChange = async (opt: option) => {
    console.log({ opt });
    if (opt.key === 'periodical') {
      const path = await getPeriodicalPath();
      router.push(path);
    } else {
      router.push(opt.key as any);
    }
  };

  if (props.type === 'dropdown') {
    return (
      <Dropdown
        size='small'
        options={btnList}
        onChange={(opt) => onChange(opt)}
      />
    );
  }

  return (
    <Button
      className='font-normal text-gray-500 dark:text-gray-400'
      variant='ghost'
      onClick={() => {
        router.push('/report/tiobe');
      }}
    >
      排行榜
    </Button>
  );
};
