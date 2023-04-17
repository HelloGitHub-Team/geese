import Link from 'next/link';
import { Dispatch, SetStateAction } from 'react';

import Button from '@/components/buttons/Button';
import Loading from '@/components/loading/Loading';
import Pagination from '@/components/pagination/Pagination';

import { formatZH } from '@/utils/day';
import { numFormat } from '@/utils/util';

import { Page } from '@/types/help';
import { VoteItemData } from '@/types/reppsitory';
import { CollectItem } from '@/types/user';

export const RepoData = ({
  data,
  setPage,
}: {
  data: Page<CollectItem | VoteItemData>;
  setPage: Dispatch<SetStateAction<number>>;
}) => {
  return data ? (
    data.data.length ? (
      <div>
        {data.data.map((item, index: number) => (
          <div
            className='flex items-center border-t py-4 first:border-t-0 dark:border-gray-700'
            key={item.repo.rid}
          >
            <div className='mr-3 self-start'>
              {(data.page - 1) * data.pageSize + index + 1}.
            </div>
            <div className='flex-1 pr-2'>
              <div className='font-bold'>{item.repo.name}</div>
              <div className='my-2 flex'>
                <span className='w-px max-w-fit flex-1 items-stretch overflow-hidden text-ellipsis whitespace-nowrap text-gray-400 dark:text-gray-300'>
                  {item.repo.summary || '-'}
                </span>
              </div>
              {/* 移动端 */}
              <div className='flex items-center text-sm text-gray-500 dark:text-gray-400 sm:hidden'>
                <div>
                  <span
                    style={{ backgroundColor: `${item.repo.lang_color}` }}
                    className='relative mr-1 box-border inline-block h-3 w-3 rounded-full border border-gray-100 align-[-1px]'
                  ></span>
                  {item.repo.primary_lang}
                </div>
                <div className='px-1'>·</div>
                <div>{numFormat(item.repo.stars, 1)}</div>
                <div className='px-1'>·</div>
                <div>{formatZH(item.created_at, 'YYYY-MM-DD')}</div>
              </div>
              {/* PC端 */}
              <div className='hidden items-center text-sm text-gray-500 dark:text-gray-400 sm:flex'>
                <div>
                  <span
                    style={{ backgroundColor: `${item.repo.lang_color}` }}
                    className='relative mr-1 box-border inline-block h-3 w-3 rounded-full border border-gray-100 align-[-1px] dark:border-gray-500'
                  ></span>
                  {item.repo.primary_lang}
                </div>
                <div className='px-1'>·</div>
                <div>{numFormat(item.repo.stars, 1)}</div>
                <div className='px-1'>·</div>
                <div>{formatZH(item.created_at, 'YYYY-MM-DD')}</div>
              </div>
            </div>

            <Link href={`/repository/${item.repo.rid}`}>
              <a>
                <Button
                  variant='light'
                  className='h-10 p-2 font-normal dark:border-gray-500 dark:bg-gray-800 dark:text-gray-500'
                >
                  查看
                </Button>
              </a>
            </Link>
          </div>
        ))}
        <div className='mt-4'>
          <Pagination
            hidden={data.total <= 10}
            PreviousText='上一页'
            NextText='下一页'
            current={data.page}
            total={data.page_total}
            onPageChange={setPage}
          />
        </div>
      </div>
    ) : (
      <div className='mt-4 text-center text-xl'>
        <div className='py-14 text-gray-300 dark:text-gray-500'>暂无项目</div>
      </div>
    )
  ) : (
    <Loading />
  );
};
