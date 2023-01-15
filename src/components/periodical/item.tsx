import { NextPage } from 'next';
import Link from 'next/link';
import { GoRepoForked } from 'react-icons/go';
import { IoIosStarOutline } from 'react-icons/io';
import { MdOutlineRemoveRedEye } from 'react-icons/md';

import { recordGoGithub } from '@/services/repository';
import { numFormat } from '@/utils/util';

import Button from '../buttons/Button';
import ImageWithPreview from '../ImageWithPreview';
import CustomLink from '../links/CustomLink';
import MDRender from '../mdRender/MDRender';

import { PeriodicalItem, PeriodicalItemProps } from '@/types/periodical';

const PeriodItem: NextPage<PeriodicalItemProps> = ({ item, index }) => {
  const onClickLink = (item: PeriodicalItem) => {
    // 调用接口记录链接点击信息
    recordGoGithub(item.rid);
  };

  return (
    <div key={item.rid} className='pb-4'>
      <div className='mb-2 flex flex-row pt-3'>
        <div className='flex w-4/5 flex-col'>
          <div className='flex w-full flex-row items-center gap-1 pb-2'>
            <div className='text-lg'>{index + 1}.</div>
            <CustomLink href={item.github_url} className='truncate'>
              <div
                onClick={() => onClickLink(item)}
                className='truncate text-ellipsis text-xl capitalize text-blue-500 hover:underline active:text-blue-500'
              >
                {item.name}
              </div>
            </CustomLink>
          </div>
          {/* stars forks watch */}
          <div className='flex flex-row text-sm text-gray-500  dark:text-gray-400 md:text-base'>
            <div className='mr-2 flex items-center'>
              <IoIosStarOutline size={15} />
              Star {numFormat(item.stars, 1)}
            </div>
            <div className='mr-2 flex items-center'>
              <GoRepoForked size={15} />
              Fork {numFormat(item.forks, 1)}
            </div>
            <div className='hidden items-center md:flex'>
              <MdOutlineRemoveRedEye size={15} />
              Watch {numFormat(item.watch, 1)}
            </div>
          </div>
        </div>
        <div className='flex h-14 flex-1 flex-row items-center justify-end pr-1'>
          <Link href={`/repository/${item.rid}`}>
            <Button
              variant='white-outline'
              className='font-normal text-gray-700'
            >
              <div className='flex flex-col items-center px-2'>
                <div className='py-2 text-sm font-medium md:text-base'>
                  详情
                </div>
              </div>
            </Button>
          </Link>
        </div>
      </div>

      {/* markdown 内容渲染 */}
      <MDRender className='markdown-body'>{item.description}</MDRender>
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
