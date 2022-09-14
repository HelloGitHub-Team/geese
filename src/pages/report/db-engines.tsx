import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';

import RankTable, { RankSearchBar } from '@/components/rankTable/RankTable';
import { ChangeColumnRender } from '@/components/report/Report';
import Seo from '@/components/Seo';

import { getDBRank } from '@/services/rank';

import { RankPageProps } from '@/types/rank';

const columns: any[] = [
  { key: 'position', title: '排名' },
  { key: 'name', title: '数据库名称' },
  { key: 'rating', title: '分数' },
  {
    key: 'change',
    title: '对比上月',
    render: ChangeColumnRender,
  },
  { key: 'db_model', title: '数据库类型' },
];

const DBEnginesPage: NextPage<RankPageProps> = ({
  year,
  month,
  monthList,
  list,
}) => {
  const router = useRouter();

  const onSearch = (key: string, value: string) => {
    console.log({ key, value });
    if (key === 'month') {
      router.push(`/report/db-engines/?month=${value}`);
    }
    if (key === 'target') {
      router.push(`${value}`);
    }
  };

  return (
    <>
      <Seo title='数据库排行 | HelloGitHub' />
      <div className='p-2 text-center'>
        <h2 className='my-4 font-light'>
          {year}年{month}月数据库排行榜
        </h2>
        <h4 className='my-2 font-light text-gray-400'>
          最新 DB-Engines 数据库排行榜，关注数据库流行动态
        </h4>

        <div className='p-4 text-left'>
          <h2 className='my-8 font-light text-gray-400'>
            DB-Engines Ranking of database management systems, September 2022
          </h2>
          <ul className=''>
            <li className='leading-loose'>
              DB-Engines 排名是按人气排名数据库管理系统，涵盖 340 多个系统。
              排名标准包括搜索系统名称时搜索引擎结果的数量、Google 趋势、 Stack
              Overflow 网站、LinkedIn、Twitter 等社交网络中的提及的情况，
              综合比较、排名。该排名每月更新一次。
            </li>
          </ul>
        </div>

        <RankSearchBar
          title='DB-Engines'
          logo='https://img.hellogithub.com/logo/db.jpg'
          monthList={monthList}
          onChange={onSearch}
        />
        <RankTable columns={columns} list={list} />

        <p className='mt-5 mb-10 text-left leading-loose'>
          以上内容均来自于 DB-Engines 发布的{' '}
          <a href='https://db-engines.com/en/ranking' className='text-blue-500'>
            DB-Engines Ranking of database management systems, September 2022
          </a>
          ， 可以阅读原文查看更多详细信息。
        </p>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const data = await getDBRank(query['month']);
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
