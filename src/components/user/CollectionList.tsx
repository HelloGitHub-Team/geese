import classNames from 'classnames';
import copy from 'copy-to-clipboard';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import {
  AiFillDelete,
  AiFillEdit,
  AiOutlineRight,
  AiOutlineShareAlt,
  AiTwotoneLock,
} from 'react-icons/ai';
import { BsThreeDots } from 'react-icons/bs';

import { useLoginContext } from '@/hooks/useLoginContext';
import {
  useCollectionData,
  useFavoriteList,
} from '@/hooks/user/useCollectionData';

import Button from '@/components/buttons/Button';
import AddCollection, {
  EditCollectionFormData,
  EditCollectionMoal,
} from '@/components/collection/AddCollection';
import BasicDialog from '@/components/dialog/BasicDialog';
import Loading from '@/components/loading/Loading';
import Message from '@/components/message';

import { deleteFavorite } from '@/services/favorite';
import { format } from '@/utils/day';

import RepoData from './RepoRecord';

import { Favorite } from '@/types/repository';
import { TranslationFunction } from '@/types/utils';

type CollectionStatusMap = {
  [index: number]: {
    status: number;
    name: string;
  };
};

const getCollectionStatus = (
  t: (key: string) => string
): CollectionStatusMap => ({
  0: { status: 0, name: t('favorite.status.pravite') },
  1: { status: 1, name: t('favorite.status.review') },
  2: { status: 2, name: t('favorite.status.public') },
});

type ModalEnum = boolean | 'delete' | 'edit' | 'action';

type ProjectListProps = {
  uid: string;
  fid: string;
  t: (key: string) => string;
};

const ProjectList = ({ uid, fid, t }: ProjectListProps) => {
  const { data, setPage } = useCollectionData(uid, fid);
  const fName = data?.favorite?.name;
  const fStatus = data?.favorite?.status;
  const collectionStatus = getCollectionStatus(t);

  const onShare = () => {
    const text = `${t('favorite.text')} ${fName}\n${t(
      'favorite.share_text'
    )}https://hellogithub.com/user/${uid}/favorite/?fid=${fid}`;
    if (copy(text)) {
      Message.success(t('favorite.share_success'));
    }
  };

  if (!data?.success) {
    return (
      <div className='mt-4 text-center text-xl'>
        <div className='py-14 text-gray-300 dark:text-gray-500'>
          {t('favorite.no_share')}
        </div>
      </div>
    );
  }

  return (
    <div className='mt-5'>
      {/* 面包屑和分享按钮 */}
      <div className='flex justify-between'>
        <div className='flex items-center'>
          <Link href={`/user/${uid}/favorite`}>
            <span className='cursor-pointer text-gray-500 hover:text-blue-500'>
              {t('favorite.text')}
            </span>
          </Link>
          <AiOutlineRight className='mx-2' />
          <span>{fName}</span>
        </div>
        {/* 公开状态才显示分享按钮 */}
        {fStatus === collectionStatus[2].status && (
          <div>
            <Button
              className='flex items-center border-0 py-1'
              onClick={onShare}
            >
              <AiOutlineShareAlt className='mr-2' />
              {t('favorite.button.share')}
            </Button>
          </div>
        )}
      </div>
      {/* 项目列表 */}
      <RepoData data={data} setPage={setPage} />
    </div>
  );
};

type CollectionListProps = {
  fid: string;
  uid: string;
  t: TranslationFunction;
};

export default function CollectionList({ fid, t, uid }: CollectionListProps) {
  const router = useRouter();
  const { data, mutate: updateCollection } = useFavoriteList(uid);

  const [activeItem, setActiveItem] = useState<Favorite>({} as Favorite);
  const [openModal, setOpenModal] = useState<ModalEnum>(false);
  const [curItem, setCurItem] = useState<Favorite>({} as Favorite);
  const collectionStatus = getCollectionStatus(t);

  const { isLogin } = useLoginContext();

  const onMouseMove = (item: Favorite) => {
    setActiveItem(item);
  };

  const onActionClick = (
    action: 'view' | 'edit' | 'delete' | 'dots',
    item: Favorite
  ) => {
    setCurItem(item);
    const actionMap = {
      view: () => {
        router.push(`/user/${uid}/favorite/?fid=${item.fid}`);
      },
      edit: () => {
        setOpenModal('edit');
      },
      delete: () => {
        setOpenModal('delete');
      },
      dots: () => {},
    };
    actionMap[action]?.();
  };

  const onDelete = async (item: Favorite) => {
    const res = await deleteFavorite(item.fid);
    if (res.success) {
      Message.success(t('favorite.del_success'));
      // 刷新收藏夹列表
      updateCollection();
      setOpenModal(false);
    } else {
      Message.error(res.message || t('favorite.del_fail'));
    }
  };

  if (!data) {
    return <Loading />;
  }

  if (fid) {
    return <ProjectList fid={fid} uid={uid} t={t} />;
  }

  return (
    <>
      {isLogin && data.in_person && (
        <div className='mt-2 text-right'>
          <AddCollection
            onFinish={() => {
              // 刷新收藏夹列表
              updateCollection();
            }}
          />
        </div>
      )}
      <div>
        {data.data?.length ? (
          data.data?.map((item) => (
            <div
              key={item.fid}
              className='cursor-pointer border-t py-3 first:border-t-0 dark:border-gray-700'
              onClick={() => onActionClick('view', item)}
              onMouseMove={() => onMouseMove(item)}
              onMouseLeave={() => setActiveItem({} as Favorite)}
            >
              <div className='flex justify-between'>
                <span
                  className={classNames({
                    'text-blue-500': activeItem?.fid === item.fid,
                  })}
                >
                  {item.name}
                </span>
                <span className='flex items-center text-sm text-gray-400'>
                  {item.status === 0 && <AiTwotoneLock className='mr-1' />}
                  {collectionStatus[item.status as number].name}
                </span>
              </div>
              <div className='mt-2 text-sm text-gray-400 dark:text-gray-300'>
                {item.description || t('favorite.no_description')}
              </div>
              {/* footer */}
              <div className='mt-2 flex justify-between text-xs text-gray-500'>
                {/* footer-left */}
                <div>
                  <span>{format(item?.created_at as string)} · </span>
                  <span>{t('favorite.repo_total', { total: item.total })}</span>
                </div>
                {/* footer-right */}
                {isLogin && data.in_person && activeItem?.fid === item.fid && (
                  <div
                    className='hidden md:inline-flex'
                    onClick={(e: any) => {
                      e.stopPropagation();
                      onActionClick(e.target.id, item);
                    }}
                  >
                    <span
                      id='edit'
                      className='inline-flex items-center hover:text-blue-400'
                    >
                      <AiFillEdit />
                      {t('favorite.button.edit')}
                    </span>
                    <span
                      id='delete'
                      className='ml-4 inline-flex items-center hover:text-blue-500'
                    >
                      <AiFillDelete />
                      {t('favorite.button.delete')}
                    </span>
                  </div>
                )}
                {/* 移动端 footer-right */}
                {isLogin && data.in_person && (
                  <div className='md:hidden'>
                    <BsThreeDots
                      onClick={(e: any) => {
                        e.stopPropagation();
                        onActionClick('dots', item);
                        setOpenModal('action');
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className='mt-4 text-center text-xl'>
            <div className='py-14 text-gray-300 dark:text-gray-500'>
              {t('favorite.empty')}
            </div>
          </div>
        )}
        {/* 删除弹窗 */}
        <BasicDialog
          className='w-5/6 max-w-xs rounded-md p-6'
          visible={openModal === 'delete'}
          maskClosable={false}
          hideClose={true}
          onClose={() => setOpenModal(false)}
        >
          <div className='text-center'>
            <div>{t('favorite.dialog.del_title')}</div>
            <div className='my-2 text-sm text-gray-500'>
              {t('favorite.dialog.del_desc')}
            </div>
          </div>
          <div className='mt-4 text-center'>
            <button
              type='button'
              onClick={() => setOpenModal(false)}
              className='inline-flex items-center justify-center gap-2 rounded-md border-2 border-gray-200 py-1 px-4 text-sm font-semibold text-blue-500 transition-all hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-700 dark:hover:border-blue-500'
            >
              {t('favorite.button.cancel')}
            </button>
            <button
              type='button'
              onClick={() => onDelete(curItem)}
              className='ml-4 inline-flex items-center justify-center gap-2 rounded-md border border-transparent bg-blue-500 py-1 px-4 text-sm font-semibold text-white transition-all hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800'
            >
              {t('favorite.button.confirm')}
            </button>
          </div>
        </BasicDialog>
        {/* 编辑弹窗 */}
        <EditCollectionMoal
          type='edit'
          visible={openModal === 'edit'}
          title={t('favorite.dialog.edit_title')}
          t={t}
          initValue={curItem as EditCollectionFormData}
          onClose={() => setOpenModal(false)}
          onFinish={() => updateCollection()}
        />
        {/* 移动端操作弹窗 */}
        <BasicDialog
          className='w-4/6 max-w-xs rounded-md p-4'
          visible={openModal === 'action'}
          maskClosable={true}
          hideClose={true}
          onClose={() => setOpenModal(false)}
        >
          <div>
            <div
              className='flex items-center border-b border-gray-100 pb-2'
              onClick={() => onActionClick('edit', curItem)}
            >
              <AiFillEdit className='mr-2' />
              {t('favorite.button.edit')}
            </div>
            <div
              className='flex items-center pt-2'
              onClick={() => onActionClick('delete', curItem)}
            >
              <AiFillDelete className='mr-2' />
              {t('favorite.button.delete')}
            </div>
          </div>
        </BasicDialog>
      </div>
    </>
  );
}
