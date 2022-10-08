import Link from 'next/link';
import { useRouter } from 'next/router';

import { TagsProps, TagType } from '@/types/tag';

export default function TagLink({ tagItems }: TagsProps) {
  const router = useRouter();
  const { sort_by = 'last', tid = '' } = router.query;

  return (
    <div className='custom-scrollbar overflow-y-auto'>
      <ul className='flex text-xs font-bold'>
        {tagItems.map((item: TagType) => {
          return (
            <li className='shrink-0 grow-0 basis-auto' key={item.tid}>
              <Link href={`/?sort_by=${sort_by}&tid=${item.tid}`}>
                {tid == item.tid ? (
                  <a className='mt-1 mr-1 inline-flex h-6 items-center justify-center rounded-xl bg-gray-100 px-0 pl-2 pr-2 text-blue-500 dark:bg-gray-700 dark:focus:bg-gray-700'>
                    {item.name}
                  </a>
                ) : (
                  <a className='mt-1 mr-1 inline-flex h-6 items-center justify-center rounded-xl px-0 pl-2 pr-2 text-gray-500 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'>
                    {item.name}
                  </a>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
