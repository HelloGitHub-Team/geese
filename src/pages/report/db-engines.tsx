import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';

import Loading from '@/components/loading/Loading';
import Navbar from '@/components/navbar/Navbar';
import RankTable, { RankSearchBar } from '@/components/rankTable/RankTable';
import {
  ChangeColumnRender,
  TrendColumnRender,
} from '@/components/report/Report';
import Seo from '@/components/Seo';

import { getDBRank } from '@/services/rank';

import { RankPageProps } from '@/types/rank';

// 排名	数据库	分数	对比上月	类型
const columns: any[] = [
  { key: 'position', title: '排名', width: 80 },
  { key: 'name', title: '数据库' },
  { key: 'rating', title: '分数' },
  {
    key: 'change',
    title: '对比上月',
    render: ChangeColumnRender,
  },
  { key: 'db_model', title: '类型' },
];

// 排名	数据库	流行度
const md_columns: any[] = [
  { key: 'position', title: '排名', width: 60 },
  { key: 'name', title: '数据库' },
  { key: 'rating', title: '分数', width: 80 },
  { key: 'change', title: '趋势', render: TrendColumnRender, width: 60 },
];

const DBEnginesPage: NextPage<RankPageProps> = ({
  year,
  month,
  monthList,
  list,
}) => {
  const router = useRouter();

  const onSearch = (key: string, value: string) => {
    if (key === 'month') {
      router.push(`/report/db-engines/?month=${value}`);
    }
    if (key === 'target') {
      router.push(`${value}`);
    }
  };

  return (
    <>
      <Seo title='数据库排名' />
      {list ? (
        <div>
          <Navbar middleText={`${year} 年 ${month} 月数据库排行榜`}></Navbar>

          <div className='my-2 bg-white px-2 pt-2 dark:bg-gray-800 md:rounded-lg'>
            <RankSearchBar
              title='DB-Engines'
              logo='https://img.hellogithub.com/logo/db.jpg'
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
                  <span className='font-bold'>「DB-Engines 排名」</span>
                  是按流行程度对数据库管理系统进行排名，涵盖 380
                  多个系统，每月更新一次。
                  排名标准包括搜索数据库名称时的搜索引擎结果的数量、Google
                  趋势、Stack
                  Overflow、社交网络和提及数据库的工作机会等数据，综合比较排名。
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

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  let ip;
  if (req.headers['x-forwarded-for']) {
    ip = req.headers['x-forwarded-for'] as string;
    ip = ip.split(',')[0] as string;
  } else if (req.headers['x-real-ip']) {
    ip = req.headers['x-real-ip'] as string;
  } else {
    ip = req.socket.remoteAddress as string;
  }

  const data = await getDBRank(ip, query['month'] as unknown as number);
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

export default DBEnginesPage;
