import Link from 'next/link';
import { useRouter } from 'next/router';
import useSWRInfinite from 'swr/infinite';

import { fetcher } from '@/services/base';
import { TagItems } from '@/typing/tag';
import { makeUrl } from '@/utils/api';

export default function TagLink() {
  const router = useRouter();
  const { sort_by = 'hot' } = router.query;
  console.log('sort_by >>>', sort_by);
  const { data } = useSWRInfinite<TagItems>(
    () => makeUrl(`/tag/search/`, { page: 1, page_size: 10, sort_by, asc: 0 }),
    fetcher
  );
  const reponse = data ? data[0].data : [];
  console.log(reponse);
  return (
    <div>
      {reponse.map((item) => {
        return (
          <Link key={item.tid} href={`/?sort_by=${sort_by}&tid=${item.tid}`}>
            <a className='inline-flex h-8 items-center justify-center rounded-lg pl-3 pr-3 text-sm font-bold text-blue-400 hover:bg-blue-400 hover:text-white'>
              {item.name}
            </a>
          </Link>
        );
      })}
    </div>
  );
}
