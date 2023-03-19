import useUserDynamicRecord from '@/hooks/useUserDynamicRecord';

import { fromNow } from '@/utils/day';

import CustomLink from '../links/CustomLink';

import { DynamicRecord } from '@/types/user';

interface Props {
  uid: string;
}

export default function DynamicRecordList(props: Props) {
  const list = useUserDynamicRecord(props.uid);

  const handleText = (item: DynamicRecord) => {
    if (item.dynamic_type == 'contribute') {
      if (item.item) {
        if (item.remark == '发布项目评论' && item.value == 2) {
          if (item.item) {
            return (
              <span>
                {`${fromNow(item.created_at)}，因评论开源项目`}
                <CustomLink
                  className='inline'
                  href={`/repository/${item.item.item_id}`}
                >
                  <span className='mx-1 cursor-pointer hover:text-blue-500'>
                    {item.item.name}
                  </span>
                </CustomLink>
                {`，收获 ${item.value} 点贡献值`}
              </span>
            );
          } else {
            return (
              <span>{`${fromNow(item.created_at)}，因评论开源项目，收获 ${
                item.value
              } 点贡献值`}</span>
            );
          }
        } else if (item.remark == '评论被置顶' && item.value == 10) {
          return (
            <span>
              {`${fromNow(item.created_at)}，因对开源项目`}
              <CustomLink
                className='inline'
                href={`/repository/${item.item.item_id}`}
              >
                <span className='mx-1 cursor-pointer hover:text-blue-500'>
                  {item.item.name}
                </span>
              </CustomLink>
              {`的评论被选为热评，收获 ${item.value} 点贡献值`}
            </span>
          );
        } else if (item.remark == '发布恶意评测' && item.value == -2) {
          return (
            <span>{`${fromNow(
              item.created_at
            )}，因发布无意义/灌水评论，扣除 2 点贡献值。`}</span>
          );
        } else if (item.remark == '提交项目' && item.value == 5) {
          return (
            <span>
              {`${fromNow(item.created_at)}，因分享优秀的开源项目`}
              <CustomLink
                className='inline'
                href={`/repository/${item.item.item_id}`}
              >
                <span className='mx-1 cursor-pointer hover:text-blue-500'>
                  {item.item.name}
                </span>
              </CustomLink>
              {`，收获 ${item.value} 点贡献值`}
            </span>
          );
        }
      } else {
        return (
          <span>{`${fromNow(item.created_at)}，因${item.remark}，收获 ${
            item.value
          } 点贡献值`}</span>
        );
      }
    }
  };

  return (
    <>
      {list?.length ? (
        <div className='text-sm'>
          {list?.map((item, index) => (
            <div className='my-4 last:mb-0 md:my-8' key={index}>
              <span className='mr-4 dark:text-gray-300'>{index + 1}.</span>
              <span className='text-gray-600 dark:text-gray-400'>
                {handleText(item)}
              </span>
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
