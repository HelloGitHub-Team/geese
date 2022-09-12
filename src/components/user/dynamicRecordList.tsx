import useUserDynamicRecord from '@/hooks/useUserDynamicRecord';

import { fromNow } from '@/utils/day';

interface Props {
  uid: string;
}

export default function DynamicRecordList(props: Props) {
  const list = useUserDynamicRecord(props.uid);

  return (
    <div className='text-sm'>
      {list?.map((item, index) => (
        <div className='my-8 last:mb-0' key={index}>
          <span className='mr-4'>{index + 1}.</span>
          <span className='text-gray-600'>{`${fromNow(item.created_at)}，因${
            item.remark
          }，收获 ${item.value} 点贡献值`}</span>
        </div>
      ))}
    </div>
  );
}
