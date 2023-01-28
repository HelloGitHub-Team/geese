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

import { getNetcraftRank } from '@/services/rank';
import { numFormat } from '@/utils/util';

import { NetcraftRankPageProps, RankDataItem } from '@/types/rank';

// 排名	服务器	市场占比	对比上月	总数
const columns: any[] = [
  { key: 'position', title: '排名', width: 80 },
  { key: 'name', title: '服务器' },
  {
    key: 'rating',
    title: '占比',
  },
  {
    key: 'change',
    title: '对比上月',
    render: ChangePercentColumnRender,
  },
  {
    key: 'total',
    title: '总数',
    render: (row: RankDataItem) => {
      return <div>{numFormat(row.total, 2, 10000)}</div>;
    },
  },
];

// 排名	服务器	市场占比 趋势
const md_columns: any[] = [
  { key: 'position', title: '排名', width: 60 },
  { key: 'name', title: '服务器' },
  { key: 'rating', title: '占比' },
  { key: 'change', title: '趋势', render: TrendColumnRender, width: 60 },
];

const serverList = [
  {
    title: 'Apache',
    content:
      '一个开放源码的网页服务器，可以在大多数计算机操作系统中运行。由于其多平台和安全性被广泛使用，是最流行的 Web服务器端软件之一。',
  },
  {
    title: 'Nginx',
    content:
      '免费开源、轻量级、高性能 Web 服务器，由伊戈尔·赛索耶夫为俄罗斯访问量第二的 Rambler.ru 站点开发。',
  },
  {
    title: 'OpenResty',
    content:
      '一个基于 Nginx 的 Web 平台，可以使用其 LuaJIT 引擎运行 Lua 脚本，由章亦春创建。',
  },
];

const NetcraftPage: NextPage<NetcraftRankPageProps> = ({
  year,
  month,
  monthList,
  all_list,
  active_list,
}) => {
  const router = useRouter();

  const onSearch = (key: string, value: string) => {
    if (key === 'month') {
      router.push(`/report/netcraft/?month=${value}`);
    }
    if (key === 'target') {
      router.push(`${value}`);
    }
  };

  return (
    <>
      <Seo title='HelloGitHub｜服务器排名' />
      {all_list ? (
        <div>
          <Navbar middleText={`${year} 年 ${month} 月服务器排行榜`}></Navbar>

          <div className='my-2 bg-white px-2 pt-2 dark:bg-gray-800 md:rounded-lg'>
            <RankSearchBar
              title='Netcraft'
              logo='https://img.hellogithub.com/logo/netcraft.jpg'
              monthList={monthList}
              onChange={onSearch}
            />
            <div className='md:hidden'>
              <div className='pb-1 text-center text-sm font-semibold dark:text-gray-300'>
                市场份额排名
              </div>
              <RankTable columns={md_columns} list={all_list} />
              <div className='pt-2 pb-1 text-center text-sm font-semibold dark:text-gray-300'>
                活跃网站排名
              </div>
              <RankTable columns={md_columns} list={active_list} />
            </div>
            <div className='hidden md:block'>
              <div className='pb-1 text-center text-sm font-semibold dark:text-gray-300'>
                市场份额排名
              </div>
              <RankTable columns={columns} list={all_list} />
              <div className='pt-2 pb-1  text-center text-sm font-semibold dark:text-gray-300'>
                活跃网站排名
              </div>
              <RankTable columns={columns} list={active_list} />
            </div>
            <div className='mt-2 rounded-lg border bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'>
              <div className='whitespace-pre-wrap leading-8'>
                <p>
                  <span className='font-bold'>「Netcraft」</span>
                  是一家总部位于英国巴斯始于 1995 年的互联网服务公司。
                  该公司官网每月发布的调研数据报告 Web Server Survey 系列
                  每月更新一次，已成为当今人们了解全球网站的服务器市场份额和排名情况的主要参考依据，
                  时常被华尔街杂志、Slashdot 等知名媒体引用。{' '}
                </p>
              </div>
              <ul className='list-disc pl-4'>
                {serverList.map((server) => {
                  return (
                    <li key={server.title} className='list-item leading-loose'>
                      <b>{server.title}：</b>
                      {server.content}
                    </li>
                  );
                })}
              </ul>
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

  const data = await getNetcraftRank(ip, query['month'] as unknown as number);
  if (!data.success) {
    return {
      notFound: true,
    };
  } else {
    return {
      props: {
        year: data.year,
        month: data.month,
        all_list: data.all_data,
        active_list: data.active_data,
        monthList: data.month_list,
      },
    };
  }
};

export default NetcraftPage;
