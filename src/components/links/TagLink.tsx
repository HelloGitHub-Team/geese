import { NoPrefetchLink } from '@/components/links/CustomLink';

import { constructURL } from '@/utils/util';

import { TagType } from '@/types/tag';

interface Props {
  year?: number;
  month?: number;
  tid?: string;
  sort_by: string;
  items: TagType[];
  rank_by: string;
}

export default function TagLink({
  tid,
  sort_by,
  items,
  rank_by,
  year,
  month,
}: Props) {
  return (
    <div className='custom-scrollbar mt-2 overflow-y-auto'>
      <ul className='flex text-xs font-bold'>
        {items.map((item: TagType) => {
          return (
            <li className='shrink-0 grow-0 basis-auto' key={item.tid}>
              <NoPrefetchLink
                href={constructURL({
                  sort_by,
                  rank_by,
                  tid: item.tid,
                  year,
                  month,
                })}
              >
                <a
                  className={`
                  mr-1 inline-flex h-6 items-center justify-center rounded-xl px-2
                  ${
                    tid === item.tid
                      ? 'bg-gray-100 text-blue-500 dark:bg-gray-700'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-blue-500 dark:text-gray-200 dark:hover:bg-gray-700'
                  }
                `}
                >
                  {item.name}
                </a>
              </NoPrefetchLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
