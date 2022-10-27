import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Navbar from '@/components/navbar/Navbar';
import Seo from '@/components/Seo';

import { getOnefile } from '@/services/article';

import { OneItemsResp, TableOneItem } from '@/types/article';

type column = {
  key: string;
  title: string;
  width: number | string;
  render: (row: any, index: number) => any;
};

// 名称	语言	描述	查看
const columns: any[] = [
  {
    key: 'oid',
    title: '名称',
    width: 130,
    render: (row: TableOneItem) => {
      return <span>{row.name}</span>;
    },
  },
  { key: 'language', title: '语言', width: 100 },
  { key: 'suggestions', title: '描述' },
];

const OneFilePage: NextPage<OneItemsResp> = ({ data }) => {
  const router = useRouter();

  const handleCode = (oid: string) => {
    router.push(`/onefile/code/${oid}`);
  };

  return (
    <>
      <Seo title='一个文件的开源项目' />

      <div className='relative pb-6'>
        <Navbar middleText='OneFile'></Navbar>
        <div className='my-2 bg-white px-2 pt-2 dark:bg-gray-800 md:rounded-lg'>
          <div className='my-2'>
            <img
              className='w-max-full'
              src='https://img.hellogithub.com/article/tK30nYW8bMiPOdB_1647991896.png'
            ></img>
            <p className='my-4 px-2'>
              OneFile 汇集了一个文件、运行简单、一看就懂的开源项目。
              包括：游戏、编译器、服务器、工具、实用库等有趣的开源项目，而且
              <strong>复制代码就能跑</strong>，点击即可在线查看源码和试玩。
            </p>
          </div>

          <div className='overflow-hidden rounded-lg border shadow dark:border-gray-700 dark:shadow-none'>
            <table className='w-min	min-w-full table-fixed divide-y-2 divide-gray-200 text-sm dark:divide-gray-700'>
              <thead>
                <tr>
                  {columns?.map(({ key, title, width = 'auto' }: column) => (
                    <th
                      key={key}
                      scope='col'
                      style={{ width: width }}
                      className='px-4 py-2 text-left text-sm font-medium uppercase text-gray-500 dark:text-gray-300 md:px-6 md:py-3'
                    >
                      {title}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                {data?.map((row: TableOneItem, index) => (
                  <tr
                    key={index}
                    className='cursor-pointer hover:bg-gray-100'
                    onClick={() => handleCode(row.oid)}
                  >
                    {columns.map(({ key, render }) => {
                      let content = row[key];
                      if (render) {
                        content = render(row, index);
                      }
                      return (
                        <td
                          key={key}
                          className='truncate whitespace-nowrap px-3 py-2 text-left text-sm font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-300 md:px-6 md:py-4'
                        >
                          {content}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='mt-2 rounded-lg border bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'>
            <div className='whitespace-pre-wrap leading-8'>
              <p>
                <span className='font-bold'>「OneFile」</span>
                是一个开源项目，在这里你可以找到有趣运行简单的程序。同时它也是一个编程挑战，你也可以提交一个文件接受挑战。
                <Link href='/onefile/join'>
                  <a>
                    <span className='cursor-pointer text-blue-400 underline hover:text-blue-500'>
                      点击加入
                    </span>
                  </a>
                </Link>{' '}
                OneFile 编程挑战，一个文件而已就写点有趣的代码吧！
              </p>
            </div>
          </div>
          <div className='h-2'></div>
        </div>
      </div>
    </>
  );
};

export default OneFilePage;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  let ip;
  if (req.headers['x-forwarded-for']) {
    ip = req.headers['x-forwarded-for'] as string;
    ip = ip.split(',')[0] as string;
  } else if (req.headers['x-real-ip']) {
    ip = req.headers['x-real-ip'] as string;
  } else {
    ip = req.socket.remoteAddress as string;
  }

  const data = await getOnefile(ip);
  if (!data.success) {
    return {
      notFound: true,
    };
  } else {
    return {
      props: {
        data: data.data,
      },
    };
  }
};
