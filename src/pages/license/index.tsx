import * as React from 'react';

import Pagination from '@/components/pagination/Pagination';
import Seo from '@/components/Seo';

import { getLicenseList, getLicenseTags } from '@/services/license';

export default function LicenseIndex() {
  const [list, setList] = React.useState([]);
  const [tags, setTags] = React.useState([]);
  const [page, setPage] = React.useState(1);

  React.useEffect(() => {
    async function getList() {
      try {
        const tagResult = await getLicenseTags();
        if (tagResult.success) {
          setTags(tagResult.data);
        }
        const listResult = await getLicenseList({});
        console.log(listResult);
        if (listResult.success) {
          setList(listResult.data);
        }
      } catch (error) {
        console.log({ error });
      }
    }
    getList();
  }, []);

  const onPageChange = (page: number) => {
    setPage(page);
  };

  return (
    <>
      <Seo title='HelloGitHub｜开源协议' />
      <div className='my-2 bg-white px-6 py-4 dark:bg-gray-800 md:rounded-lg'>
        {/* 顶部筛选栏 */}
        <div className='mt-4 mb-8 flex items-center justify-between'>
          <div>
            <span>
              标签：
              {tags.map((t) => {
                return (
                  <span
                    className='mr-2 cursor-pointer rounded bg-slate-100 py-1 px-2 text-sm text-gray-500 hover:bg-blue-200'
                    key={t.name}
                  >
                    {t.name_zh}
                  </span>
                );
              })}
            </span>
          </div>
          <div className='flex w-20 cursor-pointer justify-between text-gray-700'>
            <span className='hover:text-blue-500'>最新</span>
            <span>|</span>
            <span className='hover:text-blue-500'>最热</span>
          </div>
        </div>
        {/* 协议列表 */}
        <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
          {list.map((item) => {
            return <LicenseCard key={item.name} {...item} />;
          })}
        </div>
      </div>
      {/* 分页 */}
      <div className='my-2 bg-white px-6 py-4 dark:bg-gray-800 md:rounded-lg'>
        <Pagination
          PreviousText='上一页'
          NextText='下一页'
          total={5}
          current={page}
          onPageChange={onPageChange}
        />
      </div>
    </>
  );
}

type LicenseCardProps = {
  spdx_id: string;
  name: string;
  tags: string[];
};
function LicenseCard(props: LicenseCardProps) {
  return (
    <div className='flex h-40 w-full cursor-pointer flex-col justify-between rounded-xl border bg-white px-2 py-4 shadow-sm hover:border-blue-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:shadow-slate-700/[.7] md:p-4'>
      <div>{props.spdx_id}</div>
      <div className='text-xs text-gray-500'>{props.name}</div>
      <div className='flex flex-wrap'>
        {props.tags.slice(0, 3).map((t) => {
          return (
            <span
              className='mr-1 mt-2 rounded-sm bg-blue-100 py-1 px-2 text-xs text-gray-600'
              key={t.name}
            >
              {t.name_zh}
            </span>
          );
        })}
      </div>
    </div>
  );
}
