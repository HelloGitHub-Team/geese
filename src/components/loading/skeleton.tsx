interface Props {
  loop: number;
}

export const HomeSkeleton = ({ loop }: Props) => {
  return (
    <div className='divide-y divide-slate-100 bg-white dark:divide-slate-700 dark:bg-slate-800 md:overflow-y-hidden md:rounded-lg'>
      {[...Array(loop)].map((x, i) => (
        <div
          key={i}
          className='relative animate-pulse bg-white py-3 px-4 dark:bg-gray-800 '
        >
          <div className='flex w-full flex-row'>
            <div className='mr-2.5 hidden min-w-fit md:block'>
              <div className='h-[70px] w-[70px] rounded bg-gray-100 dark:bg-gray-700' />
            </div>
            <div className='relative flex w-full flex-col'>
              <div className='flex flex-row pb-0.5'>
                <div className='h-5 w-40 bg-gray-100 dark:bg-gray-700 md:w-60' />
              </div>
              <div className='mt-2 h-4 bg-gray-100 dark:bg-gray-700' />
              <div className='mt-1.5 flex flex-row'>
                <div className='mr-1 h-[20px] w-[20px] rounded bg-gray-100 dark:bg-gray-700 md:hidden' />
                <div className='h-5 w-4/5 bg-gray-100 dark:bg-gray-700 md:h-4' />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const TagListSkeleton = () => {
  return (
    <div className='mt-1 mb-2 animate-pulse'>
      <ul className='space-y-2'>
        <li className='h-10 rounded bg-gray-100 dark:bg-gray-700' />
        <li className='h-10 rounded bg-gray-100 dark:bg-gray-700' />
        <li className='h-10 rounded bg-gray-100 dark:bg-gray-700' />
      </ul>
    </div>
  );
};

export const StatsSkeleton = () => {
  return (
    <div className='flex flex-wrap border-b border-b-gray-300 pb-3 dark:border-b-gray-700'>
      <div className='flex-1 pr-4'>
        <div className='text-base text-gray-400'>用户总数</div>
        <div className='mt-1 h-8 w-20 animate-pulse bg-gray-100 dark:bg-gray-700' />
      </div>
      <div className='flex-1'>
        <div className='text-base text-gray-400'>开源项目</div>
        <div className='mt-1 h-8 w-20 animate-pulse bg-gray-100 dark:bg-gray-700' />
      </div>
    </div>
  );
};

export const RecommendSkeleton = ({ loop }: Props) => {
  return (
    <>
      {[...Array(loop)].map((x, i) => (
        <div key={i} className='flex flex-row rounded-md py-2'>
          <div className='flex w-full items-center px-1'>
            <div className='rounded-full bg-gray-100 dark:bg-gray-700'>
              <div className='h-10 w-10' />
            </div>
            <div className='flex w-4/5 flex-col pl-2'>
              <div className='h-3 w-3/5 bg-gray-100 dark:bg-gray-700' />
              <div className='mt-2.5 flex h-3 flex-row bg-gray-100 dark:bg-gray-700' />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export const ArticleSkeleton = () => {
  return (
    <article>
      <div className='relative animate-pulse bg-white py-2 pl-3 pr-3 hover:bg-gray-50 hover:text-blue-500  dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 md:py-3 md:pl-5'>
        <div className='flex-cloume relative flex items-center justify-between'>
          <div className='mr-2 w-full md:w-9/12'>
            <div className='h-5 w-60 bg-gray-100 dark:bg-gray-700 md:w-80' />
            <div className='my-2 pr-1 text-xs leading-loose text-gray-400 line-clamp-2 md:pr-0'>
              <div className='h-4 bg-gray-100 dark:bg-gray-700' />
              <div className='mt-1 h-4 w-4/5 bg-gray-100 dark:bg-gray-700' />
            </div>
            <div className='h-4 w-40 bg-gray-100 dark:bg-gray-700 md:w-60' />
          </div>
          <div className='relative flex w-3/12 justify-center'>
            <div className='h-20 w-24 rounded-md bg-gray-100 dark:bg-gray-700 md:w-32'></div>
          </div>
        </div>
      </div>
    </article>
  );
};

export const PeriodicalSkeleton = () => {
  return (
    <dl className='grid grid-cols-3 gap-2'>
      <div className='flex flex-col rounded-lg border border-gray-200 px-2 pt-4 pb-4 text-center dark:border-gray-700 md:px-4 md:pt-6'>
        <dt className='order-first mb-3 h-8 animate-pulse bg-gray-100 px-10 dark:bg-gray-700'></dt>
        <dd className='h-10 animate-pulse bg-gray-100 dark:bg-gray-700 md:h-14'></dd>
        <div className='mt-3 h-5 w-full animate-pulse bg-gray-100 dark:bg-gray-700'></div>
        <div className='mt-6 border-y border-gray-100 dark:border-gray-600'>
          <div className='py-3'>
            <div className='h-10 w-full bg-gray-100 dark:bg-gray-700'></div>
          </div>
        </div>
      </div>
      <div className='flex flex-col rounded-lg border border-gray-200 px-2 pt-4 pb-4 text-center dark:border-gray-700 md:px-4 md:pt-6'>
        <dt className='order-first mb-3 h-8 animate-pulse bg-gray-100 px-10 dark:bg-gray-700'></dt>
        <dd className='h-10 animate-pulse bg-gray-100 dark:bg-gray-700 md:h-14'></dd>
        <div className='mt-3 h-5 w-full animate-pulse bg-gray-100 dark:bg-gray-700'></div>
        <div className='mt-6 border-y border-gray-100 dark:border-gray-600'>
          <div className='py-3'>
            <div className='h-10 w-full bg-gray-100 dark:bg-gray-700'></div>
          </div>
        </div>
      </div>
      <div className='flex flex-col rounded-lg border border-gray-200 px-2 pt-4 pb-4 text-center dark:border-gray-700 md:px-4 md:pt-6'>
        <dt className='order-first mb-3 h-8 animate-pulse bg-gray-100 px-10 dark:bg-gray-700'></dt>
        <dd className='h-10 animate-pulse bg-gray-100 dark:bg-gray-700 md:h-14'></dd>
        <div className='mt-3 h-5 w-full animate-pulse bg-gray-100 dark:bg-gray-700'></div>
        <div className='mt-6 border-y border-gray-100 dark:border-gray-600'>
          <div className='py-3'>
            <div className='h-10 w-full bg-gray-100 dark:bg-gray-700'></div>
          </div>
        </div>
      </div>
    </dl>
  );
};

export const SearchSkeleton = () => {
  return (
    <article>
      <div className='relative animate-pulse bg-white py-3 px-4 md:rounded-lg'>
        <div className='pb-0.5'>
          <div className='mt-1 h-4 w-60 bg-gray-100 dark:bg-gray-700' />
        </div>
        <div className='mt-1 h-4 bg-gray-100 dark:bg-gray-700' />
        <div className='mt-2 flex flex-row'>
          <div className='mr-1 h-[20px] w-[20px] rounded bg-gray-100 dark:bg-gray-700' />
          <div className='h-[20px] w-3/5 bg-gray-100 dark:bg-gray-700' />
        </div>
      </div>
    </article>
  );
};

export const ProfileSkeleton = () => {
  return (
    <div className='flex w-full animate-pulse flex-col md:flex-row'>
      <div className='mx-auto flex md:block md:shrink-0'>
        <div className='h-[72px] w-[72px] rounded-full bg-gray-100 dark:bg-gray-700 md:h-20 md:w-20' />
      </div>
      <div className='flex flex-col md:ml-4 md:flex-1'>
        <div className='mx-auto mt-2 flex h-6 w-32 bg-gray-100 dark:bg-gray-700 md:mx-0 md:mb-2 md:mt-0 md:w-36 md:justify-start'></div>
        <div className='hidden space-y-2 md:block'>
          <div className='h-4 w-5/6 bg-gray-100 dark:bg-gray-700' />
          <div className='h-4 w-4/6  bg-gray-100 dark:bg-gray-700' />
        </div>
        <div className='flex flex-col items-center space-y-1 md:hidden'>
          <div className='mt-2 h-4 w-60 bg-gray-100 dark:bg-gray-700' />
          <div className='h-4 w-80 bg-gray-100 dark:bg-gray-700' />
          <div className='h-4 w-60 bg-gray-100 dark:bg-gray-700' />
        </div>
      </div>
    </div>
  );
};
