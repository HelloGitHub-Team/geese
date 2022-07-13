import Link from 'next/link';
import { useRouter } from 'next/router';

import { Tag, TagsProps } from '@/types/tag';

export default function TagLink({ tagItems }: TagsProps) {
  const router = useRouter();
  const { sort_by = 'hot', tid = '' } = router.query;

  return (
    <div className='overflow-y-auto'>
      <ul className='flex'>
        {tagItems.map((item: Tag) => {
          return (
            <li className='shrink-0 grow-0 basis-auto' key={item.tid}>
              <Link href={`/?sort_by=${sort_by}&tid=${item.tid}`}>
                {tid == item.tid ? (
                  <a className='1 inline-flex h-8 items-center justify-center rounded-lg bg-blue-400 pl-3 pr-3 text-sm font-bold text-white hover:bg-blue-400 hover:text-white'>
                    {item.name}
                  </a>
                ) : (
                  <a className='inline-flex h-8 items-center justify-center rounded-lg pl-3 pr-3 text-sm font-bold text-blue-400 hover:bg-blue-400 hover:text-white'>
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
