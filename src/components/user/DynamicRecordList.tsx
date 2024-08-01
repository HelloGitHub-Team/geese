import { fromNow } from '@/utils/day';

import CustomLink from '../links/CustomLink';

import { DynamicRecord, DynamicRecordItem } from '@/types/user';

interface Props {
  items: DynamicRecord[];
  t(key: string, num?: any): string;
  i18n_lang: string;
}

export default function DynamicRecordList({ items, t, i18n_lang }: Props) {
  const handleText = (item: DynamicRecord) => {
    const { dynamic_type, item: recordItem, remark, value, created_at } = item;

    const timeText = `${fromNow(created_at, i18n_lang)}，`;
    const valueText = t('dynamic.value_text', { value });

    const renderLink = (record: DynamicRecordItem, text = '') =>
      record ? (
        <CustomLink className='inline' href={`/repository/${record.item_id}`}>
          <span className='mx-1 cursor-pointer text-blue-500'>
            {record.name}
          </span>
        </CustomLink>
      ) : (
        text
      );

    if (dynamic_type !== 'contribute' || !recordItem) {
      return (
        <>
          {timeText}
          {t('dynamic.default')}
          {valueText}
        </>
      );
    }

    const messages: { [key: string]: JSX.Element | null } = {
      发布项目评论:
        value === 2 ? (
          <>
            {timeText}
            {t('dynamic.comment')}
            {renderLink(recordItem)}
            {valueText}
          </>
        ) : null,
      评论被置顶:
        value === 10 ? (
          <>
            {timeText}
            {t('dynamic.comment_hot')}
            {renderLink(recordItem)}
            {t('dynamic.comment_hot2')}
            {valueText}
          </>
        ) : null,
      发布恶意评测:
        value === -2 ? (
          <>
            {timeText}
            {t('dynamic.comment_bad')}
          </>
        ) : null,
      提交项目:
        value === 5 ? (
          <>
            {timeText}
            {t('dynamic.submit_repo')}
            {renderLink(recordItem)}
            {valueText}
          </>
        ) : null,
    };

    const message = messages[remark];

    return message ? (
      <>{message}</>
    ) : (
      <>
        {timeText}
        {t('dynamic.default')}
        {valueText}
      </>
    );
  };

  return (
    <>
      {items.length ? (
        <div className='text-sm'>
          {items.map((item, index) => (
            <div className='mt-4 md:mt-5' key={index}>
              <span className='mr-2 dark:text-gray-300 md:mr-4'>
                {index + 1}.
              </span>
              <span className='text-gray-600 dark:text-gray-400'>
                {handleText(item)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className='mt-4 text-center text-xl'>
          <div className='py-14 text-gray-300 dark:text-gray-500'>
            {t('dynamic.empty')}
          </div>
        </div>
      )}
    </>
  );
}
