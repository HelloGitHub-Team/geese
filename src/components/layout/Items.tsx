import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

import { fetcher } from '@/pages/api/base';
import { makeUrl } from '@/utils/api';
import { Repository, FetchData } from '@/utils/types/repoType';

import Item from './Item';

// const DataContext = createContext<Repository[]>([]);

// function Items() {
//     const { data, error } = useSWR(makeUrl(`/`), fetcher)
//     console.log(data)
//     return (
//         <div><h1>1123123</h1></div>)
//         // { data.map((item) => (<h1>{item.title}</h1>)) })

// }

// const LeftMain = ({ fallback }) => {
//     return (
//         <SWRConfig value={{ fallback }}>
//             <Items />
//         </SWRConfig>
//     )
//     // const { data, isLoading } = getItems()

//     // return (<div className='bg-content divide-y divide-slate-100 overflow-hidden'>
//     //     <DataContext.Provider value={items}>
//     //         {items.map((item) => (
//     //             <Item key= {item.item_id} repo={item}></Item>
//     //         ))}
//     //     </DataContext.Provider>
//     // </div>)
// };

// export async function getStaticProps() {
//     // `getStaticProps` is executed on the server side.
//     const items = await getItems()
//     const url = makeUrl(`/`)
//     return {
//         props: {
//             fallback: {
//                 url: items
//             }
//         }
//     }
// }

// Narrow the unknown type to the data type returned by the request
function isFetchData(value: unknown): value is FetchData {
  return (
    value instanceof Object &&
    Object.prototype.hasOwnProperty.call(value, 'data')
  );
}

const Items = () => {
  const router = useRouter();
  const [sortBy, setSortBy] = useState<string>('hot');

  useEffect(() => {
    if (router.query) {
      const { sort_by } = router.query;
      if (sort_by != undefined && !(sort_by instanceof Array)) {
        setSortBy(sort_by);
      }
    }
  }, [router]);

  const { data, error } = useSWR(makeUrl(`/`, { sort_by: sortBy }), fetcher);

  let itmesData: Repository[] = []; // store the returned real data
  if (isFetchData(data)) {
    itmesData = data.data;
  }

  if (!itmesData) {
    return (
      <div className='relative w-0 shrink grow lg:w-9/12 lg:grow-0'>
        <div className='bg-content divide-y divide-slate-100 overflow-hidden'>
          <div>loading...</div>
        </div>
      </div>
    );
  } else {
    return (
      <div className='relative w-0 shrink grow lg:w-9/12 lg:grow-0'>
        <div className='relative bg-white'>
          <div className='bg-content border-main-content mb-2 mt-2 overflow-hidden'>
            <div className='flex py-2.5 pl-4 pr-3'>
              <div className='flex items-center justify-start space-x-2'>
                <Link href='/?sort_by=hot'>
                  <a className='flex h-8 items-center whitespace-nowrap rounded-lg pl-3 pr-3 text-sm font-bold text-slate-500 hover:bg-slate-100 hover:text-blue-500'>
                    热门
                  </a>
                </Link>

                <Link href='/?sort_by=last'>
                  <a className='flex h-8 items-center whitespace-nowrap rounded-lg pl-3 pr-3 text-sm font-bold text-slate-500 hover:bg-slate-100 hover:text-blue-500'>
                    最近
                  </a>
                </Link>

                <div className='absolute top-0 right-0 p-2.5'>
                  <Link href='/create/repo/'>
                    <a className='flex h-8 items-center rounded-lg bg-blue-500 pl-4 pr-4 text-sm text-white active:bg-blue-600'>
                      提交
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='bg-content divide-y divide-slate-100 overflow-hidden'>
          {itmesData.map((item: Repository) => (
            <Item key={item.item_id} repo={item}></Item>
          ))}
        </div>
      </div>
    );
  }
};

export default Items;
