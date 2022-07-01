import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useSWR from 'swr';

import { fetcher } from '@/pages/api/base';
import { makeUrl } from '@/utils/api';
import { Repository } from '@/utils/types/repoType';

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

const Items = () => {
  const router = useRouter();
  const { sort_by = 'hot' } = router.query;
  const { data, error } = useSWR<{
    data: Repository[];
    has_more: boolean;
    page: number;
  }>(makeUrl(`/`, { sort_by }), fetcher);

  if (!data) {
    return (
      <div className='relative w-0 shrink grow lg:w-9/12 lg:grow-0'>
        <div className='bg-content divide-y divide-slate-100 overflow-hidden'>
          <div>loading...</div>
        </div>
      </div>
    );
  } else {
    const linkClassName = (sortName: string) =>
      classNames(
        'flex h-8 items-center whitespace-nowrap rounded-lg pl-3 pr-3 text-sm font-bold  hover:bg-slate-100 hover:text-blue-500',
        {
          'text-slate-500': sort_by !== sortName,
          'bg-slate-100 text-blue-500': sort_by === sortName,
        }
      );
    return (
      <div className='relative w-0 shrink grow lg:w-9/12 lg:grow-0'>
        <div className='relative bg-white'>
          <div className='bg-content border-main-content mb-2 mt-2 overflow-hidden'>
            <div className='flex py-2.5 pl-4 pr-3'>
              <div className='flex items-center justify-start space-x-2'>
                <Link href='/?sort_by=hot'>
                  <a className={linkClassName('hot')}>热门</a>
                </Link>

                <Link href='/?sort_by=last'>
                  <a className={linkClassName('last')}>最近</a>
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
          {data.data.map((item: Repository) => (
            <Item key={item.item_id} repo={item}></Item>
          ))}
        </div>
      </div>
    );
  }
};

export default Items;
