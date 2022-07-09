import Link from 'next/link';
import { useRouter } from 'next/router';
import useSWRInfinite from 'swr/infinite';

import { fetcher } from '@/pages/api/base';
import { makeUrl } from '@/utils/api';
import { HomeResponse } from '@/utils/types/repoType';

export default function TagLink() {
  const router = useRouter();
  const { sort_by = 'hot' } = router.query;
  const { data } = useSWRInfinite<HomeResponse>(
    () => makeUrl(`/tag/search/`, { page: 1, page_size: 10, sort_by, asc: 0 }),
    fetcher,
    {
      revalidateFirstPage: false,
    }
  );
  const reponse = data ? data[0].data : [];
  console.log(reponse);
  return (
    <div>
      {reponse.map((item) => {
        return (
          <Link key={item.tid} href='/?sort_by=hot'>
            <a className='inline-flex h-8 items-center justify-center rounded-lg pl-3 pr-3 text-sm font-bold text-blue-400 hover:bg-blue-400 hover:text-white'>
              {item.name}
            </a>
          </Link>
        );
      })}
    </div>
  );
}
