import useUserDetailInfo from '@/hooks/useUserDetailInfo';
import useUserDynamicRecord from '@/hooks/useUserDynamicRecord';

import { fromNow } from '@/utils/day';

interface Props {
  uid: string;
}

export default function DynamicRecordList(props: Props) {
  const userInfo = useUserDetailInfo(props.uid);
  const list = useUserDynamicRecord(props.uid);

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
