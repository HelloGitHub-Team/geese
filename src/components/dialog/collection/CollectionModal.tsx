import { AiFillDelete, AiFillEdit } from 'react-icons/ai';

import BasicDialog from '../BasicDialog';

import { Favorite } from '@/types/repository';

interface DeleteCollectionModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  t: (key: string) => string;
}

export const DeleteCollectionMoal: React.FC<DeleteCollectionModalProps> = ({
  visible,
  onClose,
  onConfirm,
  t,
}) => {
  return (
    <BasicDialog
      className='w-5/6 max-w-xs rounded-md p-6'
      visible={visible}
      maskClosable={false}
      hideClose={true}
      onClose={onClose}
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
          onClick={onClose}
          className='inline-flex items-center justify-center gap-2 rounded-md border-2 border-gray-200 py-1 px-4 text-sm font-semibold text-blue-500 transition-all hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-700 dark:hover:border-blue-500'
        >
          {t('favorite.button.cancel')}
        </button>
        <button
          type='button'
          onClick={onConfirm}
          className='ml-4 inline-flex items-center justify-center gap-2 rounded-md border border-transparent bg-blue-500 py-1 px-4 text-sm font-semibold text-white transition-all hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800'
        >
          {t('favorite.button.confirm')}
        </button>
      </div>
    </BasicDialog>
  );
};

interface MobileActionModalProps {
  visible: boolean;
  curItem: Favorite;
  onClose: () => void;
  onActionClick: (action: 'edit' | 'delete', item: Favorite) => void;
  t: (key: string) => string;
}

export const MobileActionModal: React.FC<MobileActionModalProps> = ({
  visible,
  curItem,
  onClose,
  onActionClick,
  t,
}) => {
  return (
    <BasicDialog
      className='w-4/6 max-w-xs rounded-md p-4'
      visible={visible}
      maskClosable={true}
      hideClose={true}
      onClose={onClose}
    >
      <div>
        <div
          className='flex cursor-pointer items-center border-b border-gray-100 pb-2 hover:text-blue-500'
          onClick={() => onActionClick('edit', curItem)}
        >
          <AiFillEdit className='mr-2' />
          {t('favorite.button.edit')}
        </div>
        <div
          className='flex cursor-pointer items-center pt-2 hover:text-red-500'
          onClick={() => onActionClick('delete', curItem)}
        >
          <AiFillDelete className='mr-2' />
          {t('favorite.button.delete')}
        </div>
      </div>
    </BasicDialog>
  );
};
