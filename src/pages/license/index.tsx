import classNames from 'classnames';
import { useRouter } from 'next/router';
import * as React from 'react';

import Loading from '@/components/loading/Loading';
import Pagination from '@/components/pagination/Pagination';
import Seo from '@/components/Seo';

import { getLicenseList, getLicenseTags } from '@/services/license';

import { LicenseListFetchData, ListQuery, Tag } from '@/types/license';

export default function LicenseIndex() {
  const [list, setList] = React.useState<LicenseListFetchData>();
  const [tags, setTags] = React.useState<Tag[]>([]);
  const [page, setPage] = React.useState(1);
  const [query, setQuery] = React.useState<ListQuery>({
    page,
    pageSize: 20,
    sort_by: 'last',
    tids: [],
  });
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    console.log({ query });
    setLoading(true);
    getLicenseList({ ...query })
      .then((listResult) => {
        console.log(listResult);
        if (listResult.success) {
          setLoading(false);
          setList(listResult);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [query]);

  React.useEffect(() => {
    getLicenseTags()
      .then((result) => {
        if (result.success) {
          setTags(result.data);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const onPageChange = (page: number) => {
    setPage(page);
    setQuery({
      ...query,
      page,
    });
  };

  return (
    <>
      <Seo title='HelloGitHub｜开源协议' />
      <div className='my-2 bg-white px-6 py-4 dark:bg-gray-800 md:rounded-lg'>
        {/* 顶部筛选栏 */}
        <div className='mt-4 mb-8 flex items-center justify-between'>
          <div className='flex'>
            <div className='hidden md:block'>标签：</div>
            {tags.map((t) => {
              return (
                <div
                  onClick={() => {
                    let { tids } = query;
                    if (tids.includes(t.tid)) {
                      tids = tids.filter((tid) => tid !== t.tid);
                    } else {
                      tids.push(t.tid);
                    }
                    setQuery({
                      ...query,
                      tids,
                    });
                  }}
                  className={classNames(
                    'mr-2 cursor-pointer rounded bg-slate-100 py-1 px-2 text-sm text-gray-500 hover:text-blue-400',
                    { 'bg-blue-200': query.tids.includes(t.tid) }
                  )}
                  key={t.tid}
                >
                  {t.name_zh}
                </div>
              );
            })}
          </div>
          <div className='flex w-24 cursor-pointer justify-between text-gray-700'>
            <span
              className={classNames('hover:text-blue-500', {
                'text-blue-500': query.sort_by === 'last',
              })}
              onClick={() => {
                setQuery({
                  ...query,
                  sort_by: 'last',
                });
              }}
            >
              最新
            </span>
            <span className='mx-1'>|</span>
            <span
              className={classNames('hover:text-blue-500', {
                'text-blue-500': query.sort_by === 'hot',
              })}
              onClick={() => {
                setQuery({
                  ...query,
                  sort_by: 'hot',
                });
              }}
            >
              最热
            </span>
          </div>
        </div>
        {/* 协议列表 */}
        {!loading ? (
          <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
            {list?.data?.map((item) => {
              return <LicenseCard key={item.name} {...item} />;
            })}
          </div>
        ) : (
          <Loading />
        )}
      </div>
      {/* 分页 */}
      <div className='my-2 bg-white px-6 py-4 dark:bg-gray-800 md:rounded-lg'>
        <Pagination
          PreviousText='上一页'
          NextText='下一页'
          total={list?.page_total || 0}
          current={page}
          onPageChange={onPageChange}
        />
      </div>
    </>
  );
}

type LicenseCardProps = {
  lid: string;
  spdx_id: string;
  name: string;
  tags: Tag[];
};
function LicenseCard(props: LicenseCardProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => {
        router.push(`/license/${props.lid}?spdx=${props.spdx_id}`);
      }}
      className='flex h-40 w-full cursor-pointer flex-col justify-between rounded-xl border bg-white px-2 py-4 shadow-sm hover:border-blue-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:shadow-slate-700/[.7] md:p-4'
    >
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
