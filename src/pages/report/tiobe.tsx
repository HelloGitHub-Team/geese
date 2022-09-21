import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';

import Loading from '@/components/loading/Loading';
import Navbar from '@/components/navbar/Navbar';
import RankTable, { RankSearchBar } from '@/components/rankTable/RankTable';
import {
  ChangePercentColumnRender,
  TrendColumnRender,
} from '@/components/report/Report';
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
    render: ChangePercentColumnRender,
  },
  { key: 'star', title: '年度明星语言' },
];

// 排名	编程语言	流行度
const md_columns: any[] = [
  { key: 'position', title: '排名', width: 60 },
  { key: 'name', title: '编程语言' },
  { key: 'rating', title: '流行度' },
  { key: 'change', title: '趋势', render: TrendColumnRender, width: 60 },
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
      {list ? (
        <div>
          <Navbar middleText={`${year} 年 ${month} 月编程语言排行榜`}></Navbar>

          <div className='my-2 bg-white px-2 pt-2 dark:bg-gray-800 md:rounded-lg'>
            <RankSearchBar
              title='TIOBE'
              logo='https://img.hellogithub.com/logo/tiobe.jpg'
              monthList={monthList}
              onChange={onSearch}
            />
            <div className='md:hidden'>
              <RankTable columns={md_columns} list={list} />
            </div>
            <div className='hidden md:block'>
              <RankTable columns={columns} list={list} />
            </div>
            <div className='mt-2 rounded-lg border bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'>
              <div className='whitespace-pre-wrap leading-8'>
                <p>
                  <span className='font-bold'>「TIOBE 编程社区指数」</span>
                  是一种衡量编程语言流行度的标准，由成立于 2000 年 10
                  月位于荷兰埃因霍温的 TIOBE Software BV 创建和维护。
                  该指数是根据网络搜索引擎对含有该语言名称的查询结果的数量计算出来的。该指数涵盖了
                  Google、百度、维基百科和 YouTube 的搜索结果。
                </p>
              </div>
            </div>
            <div className='h-2'></div>
          </div>
        </div>
      ) : (
        <Loading></Loading>
      )}
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
