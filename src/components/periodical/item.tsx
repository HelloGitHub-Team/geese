import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { GoCalendar, GoClock, GoRepoForked } from 'react-icons/go';
import { IoIosStarOutline } from 'react-icons/io';

import { CustomLink, NoPrefetchLink } from '@/components/links/CustomLink';

import { redirectRecord } from '@/services/home';
import { fromNow } from '@/utils/day';
import { numFormat } from '@/utils/util';

import Button from '../buttons/Button';
import ImageWithPreview from '../ImageWithPreview';
import { MDRender } from '../mdRender/MDRender';

import { PeriodicalItem, PeriodicalItemProps } from '@/types/periodical';

const InfoItem = ({
  icon: Icon,
  text,
  link,
  className = '',
}: {
  icon: React.ElementType;
  text: string | number;
  link?: string;
  className?: string;
}) => {
  const content = (
    <div className={`mr-2 flex items-center ${className}`}>
      <Icon size={15} className='mr-0.5' />
      {text}
    </div>
  );

  if (link) {
    return (
      <CustomLink href={link} className='hover:text-blue-500'>
        {content}
      </CustomLink>
    );
  }

  return content;
};

const PeriodItem: NextPage<PeriodicalItemProps> = ({ item, index }) => {
  const { t, i18n } = useTranslation('periodical');

  const onClickLink = (item: PeriodicalItem) => {
    redirectRecord('', item.rid, 'source');
  };

  return (
    <div key={item.rid} className='pb-4'>
      <div className='mb-2 flex flex-row pt-3'>
        <div className='flex w-4/5 flex-col'>
          <div className='flex w-full flex-row items-center pb-2'>
            <div className='text-lg'>{index + 1}、</div>
            <CustomLink href={item.github_url} className='truncate'>
              <div
                onClick={() => onClickLink(item)}
                className='truncate text-ellipsis text-xl text-blue-500 hover:underline active:text-blue-500'
              >
                {item.name}
              </div>
            </CustomLink>
          </div>
          {/* stars forks watch */}
          <div className='flex flex-row text-sm text-gray-500  dark:text-gray-400 md:text-base'>
            <InfoItem
              icon={IoIosStarOutline}
              text={`Star ${numFormat(item.stars, 1)}`}
            />
            <InfoItem
              icon={GoRepoForked}
              text={`Fork ${numFormat(item.forks, 1)}`}
              className='hidden md:flex'
            />
            {item.updated_at && (
              <InfoItem
                icon={GoCalendar}
                text={`Vol.${item.volume_num}`}
                link={`/periodical/volume/${item.volume_num}`}
              />
            )}
            <InfoItem
              icon={GoClock}
              text={fromNow(item.updated_at || item.publish_at, i18n.language)}
            />
          </div>
        </div>
        <div className='flex h-14 flex-1 flex-row items-center justify-end pr-1'>
          <NoPrefetchLink href={`/repository/${item.full_name}`}>
            <Button
              variant='white-outline'
              className='font-normal text-gray-700'
            >
              <div className='flex flex-col items-center px-1 md:px-2'>
                <div className='py-2 text-sm font-medium md:text-base'>
                  {t('detail_button')}
                </div>
              </div>
            </Button>
          </NoPrefetchLink>
        </div>
      </div>

      {/* markdown 内容渲染 */}
      <MDRender className='markdown-body'>
        {i18n.language == 'en'
          ? item.description_en || item.description
          : item.description}
      </MDRender>
      {/* 图片预览 */}
      {item.image_url && (
        <div className='my-2 flex justify-center'>
          <ImageWithPreview
            className='cursor-zoom-in rounded-lg'
            src={item.image_url}
            alt={item.name}
          />
        </div>
      )}
    </div>
  );
};

export default PeriodItem;
