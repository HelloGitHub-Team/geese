import classNames from 'classnames';
import copy from 'copy-to-clipboard';
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
import { NoPrefetchLink } from '@/components/links/CustomLink';
import Loading from '@/components/loading/Loading';
import Message from '@/components/message';

import { deleteFavorite } from '@/services/favorite';
import { format } from '@/utils/day';

import { EmptyState } from './Common';
import RepoData from './RepoRecord';
import ActionButton from '../buttons/ActionButton';
import AddCollection, {
  EditCollectionFormData,
  EditCollectionMoal,
} from '../dialog/collection/AddCollection';
import {
  DeleteCollectionMoal,
  MobileActionModal,
} from '../dialog/collection/CollectionModal';

import { Favorite } from '@/types/repository';
import { TranslationFunction } from '@/types/utils';

// Types
type ModalEnum = boolean | 'delete' | 'edit' | 'action';
type ActionType = 'view' | 'edit' | 'delete' | 'dots';
type CollectionStatusMap = Record<number, { status: number; name: string }>;

interface ProjectListProps {
  uid: string;
  fid: string;
  t: TranslationFunction;
}

// Utils
const getCollectionStatus = (t: TranslationFunction): CollectionStatusMap => ({
  0: { status: 0, name: t('favorite.status.pravite') },
  1: { status: 1, name: t('favorite.status.review') },
  2: { status: 2, name: t('favorite.status.public') },
});

// Components
const ShareButton = ({
  onShare,
  t,
}: {
  onShare: () => void;
  t: TranslationFunction;
}) => (
  <Button className='flex items-center border-0 py-1' onClick={onShare}>
    <AiOutlineShareAlt className='mr-2' />
    {t('favorite.button.share')}
  </Button>
);

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

  if (!data?.success) return <Loading />;

  const isPublic = fStatus === collectionStatus[2].status;

  return (
    <div className='mt-5'>
      {/* 面包屑和分享按钮 */}
      <div className='flex justify-between'>
        <div className='flex items-center px-2'>
          <NoPrefetchLink href={`/user/${uid}/favorite`}>
            <span className='cursor-pointer text-gray-500 hover:text-blue-500'>
              {t('favorite.text')}
            </span>
          </NoPrefetchLink>
          <AiOutlineRight className='mx-2' />
          <span>{fName}</span>
        </div>
        {/* 公开状态才显示分享按钮 */}
        {isPublic && <ShareButton onShare={onShare} t={t} />}
      </div>
      {/* 项目列表 */}
      <RepoData data={data} setPage={setPage} />
    </div>
  );
};

interface CollectionFooterProps {
  item: Favorite;
  isActive: boolean;
  isLogin: boolean;
  inPerson: boolean;
  onAction: (action: ActionType, item: Favorite) => void;
  t: TranslationFunction;
}

const CollectionFooter = ({
  item,
  isActive,
  isLogin,
  inPerson,
  onAction,
  t,
}: CollectionFooterProps) => (
  <div className='mt-2 flex justify-between text-xs text-gray-500'>
    <div>
      <span>{format(item?.created_at as string)} · </span>
      <span>{t('favorite.repo_total', { total: item.total })}</span>
    </div>

    {isLogin && inPerson && (
      <>
        {isActive && (
          <div className='hidden md:inline-flex'>
            <ActionButton
              icon={<AiFillEdit />}
              text={t('favorite.button.edit')}
              onClick={(e) => {
                e.stopPropagation();
                onAction('edit', item);
              }}
            />
            <ActionButton
              icon={<AiFillDelete />}
              text={t('favorite.button.delete')}
              className='ml-4'
              onClick={(e) => {
                e.stopPropagation();
                onAction('delete', item);
              }}
            />
          </div>
        )}
        <div className='md:hidden'>
          <BsThreeDots
            onClick={(e) => {
              e.stopPropagation();
              onAction('dots', item);
            }}
          />
        </div>
      </>
    )}
  </div>
);

export default function CollectionList({ fid, t, uid }: ProjectListProps) {
  const router = useRouter();
  const { data, mutate: updateCollection } = useFavoriteList(uid);
  const { isLogin } = useLoginContext();

  const [activeItem, setActiveItem] = useState<Favorite | null>(null);
  const [openModal, setOpenModal] = useState<ModalEnum>(false);
  const [curItem, setCurItem] = useState<Favorite | null>(null);

  const collectionStatus = getCollectionStatus(t);

  const handleAction = (action: ActionType, item: Favorite) => {
    setCurItem(item);
    const actions: Record<ActionType, () => void> = {
      view: () => router.push(`/user/${uid}/favorite/?fid=${item.fid}`),
      edit: () => setOpenModal('edit'),
      delete: () => setOpenModal('delete'),
      dots: () => setOpenModal('action'),
    };
    actions[action]?.();
  };

  const handleDelete = async (item: Favorite) => {
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

  const renderCollectionItem = (item: Favorite) => {
    const isActive = activeItem?.fid === item.fid;

    return (
      <div
        key={item.fid}
        className='cursor-pointer truncate border-t py-3 px-2 first:border-t-0 dark:border-gray-700'
        onClick={() => handleAction('view', item)}
        onMouseEnter={() => setActiveItem(item)}
        onMouseLeave={() => setActiveItem(null)}
      >
        <div className='flex justify-between'>
          <span className={classNames({ 'text-blue-500': isActive })}>
            {item.name}
          </span>
          <span className='flex items-center text-sm text-gray-400'>
            {item.status === 0 && <AiTwotoneLock className='mr-1' />}
            {collectionStatus[item.status as number]?.name}
          </span>
        </div>

        <div className='mt-2 text-sm text-gray-400 dark:text-gray-300'>
          {item.description || t('favorite.no_description')}
        </div>

        <CollectionFooter
          item={item}
          isActive={isActive}
          isLogin={isLogin}
          inPerson={data?.in_person as boolean}
          onAction={handleAction}
          t={t}
        />
      </div>
    );
  };

  if (!data) return <Loading />;
  if (fid) return <ProjectList fid={fid} uid={uid} t={t} />;

  return (
    <>
      {isLogin && data.in_person && (
        <div className='mt-2 text-right'>
          <AddCollection onFinish={updateCollection} />
        </div>
      )}

      <div>
        {data.data?.length ? (
          data.data.map(renderCollectionItem)
        ) : data.in_person ? (
          <EmptyState message={t('favorite.empty')} />
        ) : (
          <EmptyState message={t('favorite.no_share')} />
        )}
      </div>
      {/* 删除弹窗 */}
      <DeleteCollectionMoal
        visible={openModal === 'delete'}
        onClose={() => setOpenModal(false)}
        onConfirm={() => curItem && handleDelete(curItem)}
        t={t}
      />
      {/* 编辑弹窗 */}
      <EditCollectionMoal
        type='edit'
        visible={openModal === 'edit'}
        title={t('favorite.dialog.edit_title')}
        initValue={curItem as EditCollectionFormData}
        onClose={() => setOpenModal(false)}
        onFinish={() => updateCollection()}
      />
      {/* 移动端操作弹窗 */}
      <MobileActionModal
        visible={openModal === 'action'}
        curItem={curItem as Favorite}
        onClose={() => setOpenModal(false)}
        onActionClick={(action) => handleAction(action, curItem as Favorite)}
        t={t}
      />
    </>
  );
}
