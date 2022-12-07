import classNames from 'classnames';
import { useState } from 'react';
import { AiFillDelete, AiFillEdit, AiTwotoneLock } from 'react-icons/ai';

import useCollectionData from '@/hooks/user/useCollectionData';

import AddCollection, {
  EditCollectionFormData,
  EditCollectionMoal,
} from '@/components/collection/AddCollection';
import BasicDialog from '@/components/dialog/BasicDialog';
import Loading from '@/components/loading/Loading';
import Message from '@/components/message';

import { deleteCollection } from '@/services/repository';

import { Favorite } from '@/types/reppsitory';

type CollectionStatusMap = {
  [index: number]: {
    status: number;
    name: string;
  };
};

const collectionStatus: CollectionStatusMap = {
  0: { status: 0, name: '隐私' },
  1: { status: 1, name: '审核中' },
  2: { status: 2, name: '公开' },
};

export default function CollectionList() {
  const { data, mutate: updateCollection } = useCollectionData();
  // data = {
  //   data: [],
  // };
  // data = {
  //   data: new Array(0).fill({}).map((_, i) => ({
  //     fid: `C3RJ4uhcdyHftw0${i}`,
  //     name: `收藏夹${i + 1}`,
  //     description: '收藏夹描述',
  //     uid: 'test',
  //     status: 1,
  //     pv: 0,
  //     uv: 0,
  //     featured: false,
  //     created_at: '2022-12-02T14:49:51',
  //     updated_at: '2022-12-02T14:49:51',
  //     publish_at: null,
  //   })),
  // };

  const [activeItem, setActiveItem] = useState<Favorite>({} as Favorite);
  const [openModal, setOpenModal] = useState<boolean | 'delete' | 'edit'>(
    false
  );
  const [curItem, setCurItem] = useState<Favorite>({} as Favorite);

  const onMouseMove = (item: Favorite) => {
    setActiveItem(item);
  };

  const onActionClick = (
    action: 'view' | 'edit' | 'delete',
    item: Favorite
  ) => {
    setCurItem(item);
    const actionMap = {
      view: () => {},
      edit: () => {
        setOpenModal('edit');
      },
      delete: () => {
        setOpenModal('delete');
      },
    };
    actionMap[action]?.();
  };

  const onDelete = async (item: Favorite) => {
    const res = await deleteCollection(item.fid);
    console.log({ res });
    if (res.success) {
      Message.success('删除成功');
      // 刷新收藏夹列表
      updateCollection();
      setOpenModal(false);
    } else {
      Message.error(res.message || '删除失败');
    }
  };

  if (!data) {
    return <Loading />;
  }

  return (
    <div className='my-4'>
      <div className='text-right'>
        <AddCollection
          onFinish={() => {
            // 刷新收藏夹列表
            updateCollection();
          }}
        />
      </div>
      {data.data?.length ? (
        data.data?.map((item) => (
          <div
            key={item.fid}
            className='cursor-pointer border-b border-gray-100 py-3'
            onClick={() => onActionClick('view', item)}
            onMouseMove={() => onMouseMove(item)}
            onMouseLeave={() => setActiveItem({} as Favorite)}
          >
            <div className='flex justify-between'>
              <span
                className={classNames({
                  'text-blue-400': activeItem?.fid === item.fid,
                })}
              >
                {item.name}
              </span>
              <span className='flex items-center text-sm text-gray-400'>
                {item.status === 0 && <AiTwotoneLock className='mr-1' />}
                {collectionStatus[item.status as number]?.name}
              </span>
            </div>
            {item.description && (
              <div className='mt-2 text-sm text-gray-600'>
                {item.description}
              </div>
            )}

            {/* footer */}
            <div className='mt-2 flex justify-between text-xs text-gray-500'>
              {/* footer-left */}
              <div>
                <span>{item.updated_at?.replace('T', ' ')} 更新 · </span>
                <span>共有 {item.uv} 个项目</span>
              </div>
              {/* footer-right */}
              {activeItem?.fid === item.fid && (
                <div
                  className='inline-flex'
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
                    编辑
                  </span>
                  <span
                    id='delete'
                    className='ml-4 inline-flex items-center hover:text-blue-400'
                  >
                    <AiFillDelete /> 删除
                  </span>
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className='mt-4 text-center text-xl'>
          <div className='py-14 text-gray-300 dark:text-gray-500'>暂无收藏</div>
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
          <div>确定删除该收藏夹吗？</div>
          <div className='my-2 text-sm text-gray-500'>
            删除收藏夹同时也会移除收藏夹中内容
          </div>
        </div>
        <div className='mt-4 text-center'>
          <button
            type='button'
            onClick={() => setOpenModal(false)}
            className='inline-flex items-center justify-center gap-2 rounded-md border-2 border-gray-200 py-1 px-4 text-sm font-semibold text-blue-500 transition-all hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-700 dark:hover:border-blue-500'
          >
            取消
          </button>
          <button
            type='button'
            onClick={() => onDelete(curItem)}
            className='ml-4 inline-flex items-center justify-center gap-2 rounded-md border border-transparent bg-blue-500 py-1 px-4 text-sm font-semibold text-white transition-all hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800'
          >
            确认删除
          </button>
        </div>
      </BasicDialog>
      {/* 编辑弹窗 */}
      <EditCollectionMoal
        type='edit'
        visible={openModal === 'edit'}
        title='编辑收藏夹'
        initValue={curItem as EditCollectionFormData}
        onClose={() => setOpenModal(false)}
        onFinish={() => updateCollection()}
      />
    </div>
  );
}
