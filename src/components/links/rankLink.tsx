import { NoPrefetchLink } from '@/components/links/CustomLink';

import { constructURL } from '@/utils/util';

import { RankItem } from '@/types/home';

interface Props {
  year?: number;
  month?: number;
  tid?: string;
  sort_by: string;
  rank_by: string;
  items: RankItem[];
}

export default function RankLink(props: Props) {
  const currentDate = new Date();
  const defaultYear = currentDate.getFullYear();
  const defaultMonth = currentDate.getMonth(); // 上个月，如果是1月则为0

  // 设置默认值并处理边界条件
  const yearNum = props.year ?? defaultYear - 1;
  const monthlyYearNum =
    props.year ?? (defaultMonth === 0 ? defaultYear - 1 : defaultYear);
  const monthNum = props.month ?? (defaultMonth === 0 ? 12 : defaultMonth);

  return (
    <div className='custom-scrollbar overflow-y-auto'>
      <ul className='flex text-xs font-semibold'>
        {props.items.map((item: RankItem) => {
          return (
            <li className='shrink-0 grow-0 basis-auto' key={item.key}>
              {item.month ? (
                <NoPrefetchLink
                  href={constructURL({
                    sort_by: props.sort_by,
                    rank_by: props.rank_by,
                    tid: props.tid,
                    year: item.year,
                    month: item.month,
                  })}
                >
                  {item.key == `${monthlyYearNum}.${monthNum}` ? (
                    <a className='mt-1 mr-1 inline-flex h-6 items-center justify-center rounded-xl bg-gray-100 px-0 pl-2 pr-2 text-blue-500 dark:bg-gray-700 dark:focus:bg-gray-700'>
                      {item.name}
                    </a>
                  ) : (
                    <a className='mt-1 mr-1 inline-flex h-6 items-center justify-center rounded-xl px-0 pl-2 pr-2 text-gray-500 hover:bg-gray-100 hover:text-blue-500 dark:text-gray-200 dark:hover:bg-gray-700'>
                      {item.name}
                    </a>
                  )}
                </NoPrefetchLink>
              ) : (
                <NoPrefetchLink
                  href={constructURL({
                    sort_by: props.sort_by,
                    rank_by: props.rank_by,
                    tid: props.tid,
                    year: item.year,
                  })}
                >
                  {item.key == `${yearNum}` ? (
                    <a className='mt-1 mr-1 inline-flex h-6 items-center justify-center rounded-xl bg-gray-100 px-0 pl-2 pr-2 text-blue-500 dark:bg-gray-700 dark:focus:bg-gray-700'>
                      {item.name}
                    </a>
                  ) : (
                    <a className='mt-1 mr-1 inline-flex h-6 items-center justify-center rounded-xl px-0 pl-2 pr-2 text-gray-500 hover:bg-gray-100 hover:text-blue-500 dark:text-gray-200 dark:hover:bg-gray-700'>
                      {item.name}
                    </a>
                  )}
                </NoPrefetchLink>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
