import { useRouter } from 'next/router';

import useUserDetailInfo from '@/hooks/useUserDetailInfo';
import useUserDynamicRecord from '@/hooks/useUserDynamicRecord';

import { fromNow } from '@/utils/day';

export default function DynamicRecordList() {
  const router = useRouter();
  const userInfo = useUserDetailInfo(router.query.uid as string);
  const list = useUserDynamicRecord(router.query.uid as string);

  return (
    <>
      {list?.map((item, index) => (
        <div key={index}>{`${userInfo?.nickname}在 ${fromNow(
          item.created_at
        )} ${item.remark} 收获 ${item.value} 点贡献值`}</div>
      ))}
    </>
  );
}
