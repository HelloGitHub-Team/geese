import { useRouter } from 'next/router';
import { AiOutlineTrophy } from 'react-icons/ai';

import HeaderBtn from '@/components/buttons/HeaderBtn';
import type { option } from '@/components/dropdown/Dropdown';
import Dropdown from '@/components/dropdown/Dropdown';

type RankButtonProps = {
  type?: '' | 'dropdown';
};

const btnList: option[] = [
  { key: '/', value: '首页' },
  { key: '/periodical/volume', value: '月刊' },
  { key: '/report/tiobe', value: '榜单' },
  { key: '/article', value: '文章' },
  { key: '/onefile', value: 'OneFile' },
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
    <HeaderBtn pathname='/report/tiobe'>
      <AiOutlineTrophy className='mr-0.5' />
      <span>榜单</span>
    </HeaderBtn>
  );
};

export default RankButton;
