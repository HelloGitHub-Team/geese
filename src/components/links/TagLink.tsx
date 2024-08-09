import { NoPrefetchLink } from '@/components/links/CustomLink';

import { TagType } from '@/types/tag';

interface Props {
  tid: string;
  sort_by: string;
  items: TagType[];
}

export default function TagLink(props: Props) {
  return (
    <div className='custom-scrollbar overflow-y-auto'>
      <ul className='flex text-xs font-bold'>
        {props.items.map((item: TagType) => {
          return (
            <li className='shrink-0 grow-0 basis-auto' key={item.tid}>
              <NoPrefetchLink
                href={`/?sort_by=${props.sort_by}&tid=${item.tid}`}
              >
                {props.tid == item.tid ? (
                  <a className='mt-1 mr-1 inline-flex h-6 items-center justify-center rounded-xl bg-gray-100 px-0 pl-2 pr-2 text-blue-500 dark:bg-gray-700 dark:focus:bg-gray-700'>
                    {item.name}
                  </a>
                ) : (
                  <a className='mt-1 mr-1 inline-flex h-6 items-center justify-center rounded-xl px-0 pl-2 pr-2 text-gray-500 hover:bg-gray-100 hover:text-blue-500 dark:text-gray-200 dark:hover:bg-gray-700'>
                    {item.name}
                  </a>
                )}
              </NoPrefetchLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
