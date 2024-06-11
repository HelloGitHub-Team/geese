import { fromNow } from '@/utils/day';

import CustomLink from '../links/CustomLink';

import { DynamicRecord } from '@/types/user';

interface Props {
  items: DynamicRecord[];
}

export default function DynamicRecordList({ items }: Props) {
  const handleText = (item: DynamicRecord) => {
    const { dynamic_type, item: recordItem, remark, value, created_at } = item;

    const timeText = `${fromNow(created_at)}，`;
    const valueText = `收获 ${value} 点贡献值`;

    const renderLink = (text: string) =>
      recordItem ? (
        <CustomLink
          className='inline'
          href={`/repository/${recordItem.item_id}`}
        >
          <span className='mx-1 cursor-pointer text-blue-500'>
            {recordItem.name}
          </span>
        </CustomLink>
      ) : (
        text
      );

    if (dynamic_type === 'contribute' && recordItem) {
      switch (remark) {
        case '发布项目评论':
          return value === 2 ? (
            <span>
              {timeText}因评论开源项目{renderLink('')}，{valueText}
            </span>
          ) : null;
        case '评论被置顶':
          return value === 10 ? (
            <span>
              {timeText}因对开源项目{renderLink('')}的评论被选为热评，
              {valueText}
            </span>
          ) : null;
        case '发布恶意评测':
          return value === -2 ? (
            <span>{timeText}因发布无意义/灌水评论，扣除 2 点贡献值。</span>
          ) : null;
        case '提交项目':
          return value === 5 ? (
            <span>
              {timeText}因分享优秀的开源项目{renderLink('')}，{valueText}
            </span>
          ) : null;
        default:
          return (
            <span>
              {timeText}因{remark}，{valueText}
            </span>
          );
      }
    }
    return (
      <span>
        {timeText}因{remark}，{valueText}
      </span>
    );
  };

  return (
    <>
      {items.length ? (
        <div className='text-sm'>
          {items.map((item, index) => (
            <div className='mt-4 md:mt-5' key={index}>
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
