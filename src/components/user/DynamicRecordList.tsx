import { fromNow } from '@/utils/day';

import { EmptyState } from './Common';
import { CustomLink } from '../links/CustomLink';

import { DynamicRecord, DynamicRecordItem } from '@/types/user';
import { TranslationFunction } from '@/types/utils';

interface Props {
  items: DynamicRecord[];
  t: TranslationFunction;
  i18n_lang: string;
}

type MessageRenderer = (params: {
  timeText: string;
  recordItem: DynamicRecordItem;
  value: number;
  t: TranslationFunction;
}) => JSX.Element;

const RepoLink: React.FC<{ record: DynamicRecordItem; fallback?: string }> = ({
  record,
  fallback = '',
}) => {
  if (!record) return <>{fallback}</>;

  return (
    <CustomLink className='inline' href={`/repository/${record.item_id}`}>
      <span className='mx-1 cursor-pointer text-blue-500'>{record.name}</span>
    </CustomLink>
  );
};

const DynamicRecordList: React.FC<Props> = ({ items, t, i18n_lang }) => {
  const messageRenderers: Record<string, MessageRenderer> = {
    发布项目评论: ({ timeText, recordItem, value, t }) => (
      <>
        {timeText}
        {t('dynamic.comment')}
        <RepoLink record={recordItem} />
        {t('dynamic.value_text', { value })}
      </>
    ),
    评论被置顶: ({ timeText, recordItem, value, t }) => (
      <>
        {timeText}
        {t('dynamic.comment_hot')}
        <RepoLink record={recordItem} />
        {t('dynamic.comment_hot2')}
        {t('dynamic.value_text', { value })}
      </>
    ),
    发布恶意评测: ({ timeText, t }) => (
      <>
        {timeText}
        {t('dynamic.comment_bad')}
      </>
    ),
    提交项目: ({ timeText, recordItem, value, t }) => (
      <>
        {timeText}
        {t('dynamic.submit_repo')}
        <RepoLink record={recordItem} />
        {t('dynamic.value_text', { value })}
      </>
    ),
  };

  const renderDefaultMessage = (timeText: string, value: number) => (
    <>
      {timeText}
      {t('dynamic.default')}
      {t('dynamic.value_text', { value })}
    </>
  );

  const renderDynamicText = (item: DynamicRecord): JSX.Element => {
    const { dynamic_type, item: recordItem, remark, value, created_at } = item;
    const timeText = `${fromNow(created_at, i18n_lang)}，`;

    // 非贡献类型或无记录项时返回默认消息
    if (dynamic_type !== 'contribute' || !recordItem) {
      return renderDefaultMessage(timeText, value);
    }

    const renderer = messageRenderers[remark];
    if (!renderer) return renderDefaultMessage(timeText, value);

    return renderer({ timeText, recordItem, value, t });
  };

  if (!items.length) {
    return <EmptyState message={t('dynamic.empty')} />;
  }

  return (
    <div className='mt-4 text-sm'>
      {items.map((item, index) => (
        <div className='p-2' key={`dynamic-${item.created_at}-${index}`}>
          <span className='mr-2 dark:text-gray-300 md:mr-4'>{index + 1}.</span>
          <span className='text-gray-600 dark:text-gray-400'>
            {renderDynamicText(item)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default DynamicRecordList;
