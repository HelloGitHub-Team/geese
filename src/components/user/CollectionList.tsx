import Link from 'next/link';

import useCollectionData from '@/hooks/user/useCollectionData';

import Button from '@/components/buttons/Button';
import Loading from '@/components/loading/Loading';
import Pagination from '@/components/pagination/Pagination';

import { numFormat } from '@/utils/util';

interface Props {
  uid: string;
}

export default function CollectionList(props: Props) {
  const { data, setPage } = useCollectionData(props.uid);

  return data ? (
    data.data.length ? (
      <div>
        {data.data.map((item, index) => (
          <div
            className='flex items-center border-t py-4 first:border-t-0'
            key={item.repo.rid}
          >
            <div className='mr-4 self-start'>
              {(data.page - 1) * data.pageSize + index + 1}.
            </div>
            <div className='flex-1 pr-2'>
              <div className='font-bold'>{item.repo.name}</div>
              <div className='my-2 flex'>
                <span className='w-px max-w-fit flex-1 items-stretch overflow-hidden text-ellipsis whitespace-nowrap text-gray-400'>
                  {item.repo.description}
                </span>
              </div>
              {/* 移动端 */}
              <div className='flex items-center text-sm text-gray-500 sm:hidden'>
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
                <div>{item.repo.has_chinese ? '中文' : '非中文'}</div>
              </div>
              {/* PC端 */}
              <div className='hidden items-center text-sm text-gray-500 sm:flex'>
                <div>
                  主语言：
                  <span
                    style={{ backgroundColor: `${item.repo.lang_color}` }}
                    className='relative mr-1 box-border inline-block h-3 w-3 rounded-full border border-gray-100 align-[-1px]'
                  ></span>
                  {item.repo.primary_lang}
                </div>
                <div className='px-1'>·</div>
                <div>Star：{numFormat(item.repo.stars, 1)}</div>
                <div className='px-1'>·</div>
                <div>中文：{item.repo.has_chinese ? '是' : '否'}</div>
              </div>
            </div>
            <Link href={`/repository/${item.repo.rid}`} rel='noreferrer'>
              <Button
                className='h-8 px-2 text-sm font-normal'
                variant='outline'
              >
                查看
              </Button>
            </Link>
          </div>
        ))}
        <Pagination
          hidden={data.total <= 10}
          PreviousText='上一页'
          NextText='下一页'
          current={data.page}
          total={data.page_total}
          onPageChange={setPage}
        />
      </div>
    ) : (
      <div className='mt-4 text-center text-xl'>
        <div className='py-14 text-gray-300'>暂无收藏</div>
      </div>
    )
  ) : (
    <Loading />
  );
}
