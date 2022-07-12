import Link from 'next/link';
import { useRouter } from 'next/router';
import useSWRInfinite from 'swr/infinite';

import { fetcher } from '@/services/base';
import { TagItems } from '@/typing/tag';
import { makeUrl } from '@/utils/api';

export default function TagLink() {
  const router = useRouter();
  const { sort_by = 'hot', tid = '' } = router.query;
  console.log('sort_by >>>', sort_by);
  const { data } = useSWRInfinite<TagItems>(
    () => makeUrl(`/tag/search/`, { page: 1, page_size: 10, sort_by, asc: 0 }),
    fetcher,
    {
      revalidateFirstPage: false,
    }
  );
  const reponse = data ? data[0].data : [];
  console.log(reponse);
  return (
    <div className='overflow-y-auto'>
      <ul className='flex'>
        {reponse.map((item) => {
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
