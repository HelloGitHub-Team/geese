import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';

import RankTable, { RankSearchBar } from '@/components/rankTable/RankTable';
import { ChangeColumnRender } from '@/components/report/Report';
import Seo from '@/components/Seo';

import { getNetcraftRank } from '@/services/rank';

import { RankDataItem, RankPageProps } from '@/types/rank';

const columns: any[] = [
  { key: 'position', title: '排名' },
  { key: 'name', title: '服务器名称' },
  {
    key: 'rating',
    title: '市场占比',
    render: (row: RankDataItem) => {
      return <div>{row.rating}%</div>;
    },
  },
  {
    key: 'change',
    title: '对比上月',
    render: ChangeColumnRender,
  },
  {
    key: 'total',
    title: '总数',
    render: (row: RankDataItem) => {
      return <div>{row.total?.toLocaleString()}</div>;
    },
  },
];

const serverList = [
  {
    title: 'Apache',
    content:
      'Apache 软件基金会的一个开放源码的网页服务器，可以在大多数计算机操作系统中运行。由于其多平台和安全性被广泛使用，是最流行的 Web服务器端软件之一。它快速、可靠并且可通过简单的 API 扩展，将 Perl/Python 等解释器编译到服务器中。',
  },
  {
    title: 'Nginx',
    content:
      '由伊戈尔·赛索耶夫为俄罗斯访问量第二的 Rambler.ru 站点开发的，免费开源、轻量级、高性能 Web 服务器。',
  },
  { title: 'Google', content: '谷歌自主开发的 Google Web Server，简称 gws 。' },
];

const NetcraftPage: NextPage<RankPageProps> = ({
  year,
  month,
  monthList,
  list,
}) => {
  const router = useRouter();

  const onSearch = (key: string, value: string) => {
    console.log({ key, value });
    if (key === 'month') {
      router.push(`/report/netcraft/?month=${value}`);
    }
    if (key === 'target') {
      router.push(`${value}`);
    }
  };

  return (
    <>
      <Seo title='服务器排行 | HelloGitHub' />
      <div className='p-2 text-center'>
        <h2 className='my-4 font-light'>
          {year}年{month}月 Web 服务器排行榜
        </h2>
        <h4 className='my-2 font-light text-gray-400'>
          最新 Netcraft 服务器排行榜，关注服务器流行动态
        </h4>

        <div className='p-4 text-left'>
          <h2 className='my-8 font-light text-gray-400'>Web 服务器调查报告</h2>
          <ul className=''>
            <li className='leading-loose'>
              Netcraft 是一家总部位于英国巴斯始于 1995 年的互联网服务公司。
              该公司官网每月发布的调研数据报告：Web Server Survey 系列
              已成为当今人们了解全球网站的服务器市场份额、排名情况的主要参考依据，
              时常被诸如 HelloGitHub、华尔街杂志、英国
              BBC、Slashdot，等知名媒体引用。 每月更新一次。
            </li>
          </ul>
        </div>

        <h3 className='my-4 font-light text-gray-400'>市场份额排名</h3>
        <RankSearchBar
          title='Netcraft'
          logo='https://img.hellogithub.com/logo/netcraft.jpg'
          monthList={monthList}
          onChange={onSearch}
        />
        <RankTable columns={columns} list={list} />
        <div className='p-4 text-left'>
          <h2 className='my-8 font-light text-gray-400'>Web Server 说明</h2>
          <ul className='list-disc'>
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
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const data = await getNetcraftRank(query['month']);
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

export default NetcraftPage;
