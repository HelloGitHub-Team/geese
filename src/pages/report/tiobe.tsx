import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';

import RankTable, { RankSearchBar } from '@/components/rankTable/RankTable';
import { ChangeColumnRender } from '@/components/report/Report';
import Seo from '@/components/Seo';

import { getTiobeRank } from '@/services/rank';

import { RankPageProps } from '@/types/rank';

// 排名	编程语言	流行度	对比上月	年度明星语言
const columns: any[] = [
  { key: 'position', title: '排名', width: 80 },
  { key: 'name', title: '编程语言' },
  { key: 'rating', title: '流行度' },
  {
    key: 'change',
    title: '对比上月',
    render: ChangeColumnRender,
  },
  { key: 'star', title: '年度明星语言' },
];

const TiobePage: NextPage<RankPageProps> = ({
  year,
  month,
  monthList,
  list,
}) => {
  const router = useRouter();

  const onSearch = (key: string, value: string) => {
    console.log({ key, value });
    if (key === 'month') {
      router.push(`/report/tiobe/?month=${value}`);
    }
    if (key === 'target') {
      router.push(`${value}`);
    }
  };

  return (
    <>
      <Seo title='编程语言排行 | HelloGitHub' />
      <div className='mb-10 p-2 text-center'>
        <h2 className='my-4 font-light'>
          {year}年{month}月编程语言排行榜
        </h2>
        <h4 className='my-2 font-light text-gray-400'>
          最新 TIOBE 编程语言排行榜，关注编程语言动态
        </h4>
        <RankSearchBar
          title='TIOBE'
          logo='https://img.hellogithub.com/logo/tiobe.jpg'
          monthList={monthList}
          onChange={onSearch}
        />
        <RankTable columns={columns} list={list} />
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const data = await getTiobeRank(query['month'] as unknown as number);
  if (!data.success) {
    return {
      notFound: true,
    };
  } else {
    return {
      props: {
        year: data.year,
        month: data.month,
        list: data.data,
        monthList: data.month_list,
      },
    };
  }
};

export default TiobePage;
