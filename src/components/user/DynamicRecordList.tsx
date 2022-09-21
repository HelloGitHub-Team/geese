import useUserDynamicRecord from '@/hooks/useUserDynamicRecord';

import { fromNow } from '@/utils/day';

interface Props {
  uid: string;
}

export default function DynamicRecordList(props: Props) {
  const list = useUserDynamicRecord(props.uid);

  return (
    <>
      {list?.length ? (
        <div className='text-sm'>
          {list?.map((item, index) => (
            <div className='my-4 last:mb-0 md:my-8' key={index}>
              <span className='mr-4 dark:text-gray-300'>{index + 1}.</span>
              <span className='text-gray-600 dark:text-gray-400'>{`${fromNow(
                item.created_at
              )}，因${item.remark}，收获 ${item.value} 点贡献值`}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className='mt-4 text-center text-xl'>
          <div className='py-14 text-gray-300 dark:text-gray-500'>暂无动态</div>
        </div>
      )}
    </>
  );
}
