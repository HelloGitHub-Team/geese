import { useCallback, useEffect, useRef, useState } from 'react';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { VscChromeClose } from 'react-icons/vsc';
import Sortable from 'sortablejs';

import { useLoginContext } from '@/hooks/useLoginContext';

import Button from '@/components/buttons/Button';
import { FeedbackModal } from '@/components/dialog/Feedback';
import GroupItem from '@/components/dialog/GroupItem';
import Message from '@/components/message';

import { getEffectedTags, getPortalTagGroups } from '@/services/tag';

import BasicDialog from '../dialog/BasicDialog';

import { PortalTag, PortalTagGroup } from '@/types/tag';

const maxTotal = 20;

export function TagModal({
  children,
}: // eslint-disable-next-line unused-imports/no-unused-vars
// updateTags,
{
  children: JSX.Element;
  updateTags: any;
}) {
  // eslint-disable-next-line unused-imports/no-unused-vars
  // const [loading, setLoading] = useState<boolean>(false);
  const [loading, _] = useState<boolean>(false);
  const [total, setTotal] = useState(0);
  const { isLogin, login } = useLoginContext();
  const [portalTagGroups, setPortalTagGroups] = useState<PortalTagGroup[]>([]);
  const [effectedTags, setEffectedTags] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const portalTagGroupsRef = useRef(portalTagGroups);
  useEffect(() => {
    portalTagGroupsRef.current = portalTagGroups;
  }, [portalTagGroups]);

  const targetBox = useRef<HTMLDivElement>(null);

  function closeModal() {
    setIsOpen(false);
    setTotal(0);
  }

  const openModal = async () => {
    if (!isLogin) {
      return login();
    } else {
      const eTags = await getEffectedTags();
      setEffectedTags(eTags);
      setTotal(effectedTags.length);
      setIsOpen(true);
    }
  };
  const autoReorderTags = useCallback(() => {
    const items = document.querySelectorAll('.target-box > *');
    const tidList = Array.from(items).map(
      (m) => (m as HTMLElement).dataset.tid ?? ''
    );
    setEffectedTags(tidList);
    setTotal(tidList.length);
  }, [effectedTags]);
  const removeTag = (tid?: string) => {
    if (tid) {
      const newTags = effectedTags.filter((f) => f !== tid);
      setEffectedTags(newTags);
      setTotal(newTags.length);
    }
  };
  const saveTags = async () => {
    console.log(' log -：66 effectedTags', effectedTags);
    if (effectedTags.length <= 20) {
      /* todo 调用接口存一下 */
    } else {
      Message.error('最多只能选择20个标签');
    }
  };

  const fetchPortalTagGroups = useCallback(async () => {
    const portalTagGroups = await getPortalTagGroups();
    setPortalTagGroups(portalTagGroups);
  }, []);

  useEffect(() => {
    fetchPortalTagGroups();
  }, [fetchPortalTagGroups]);

  useEffect(() => {
    if (targetBox.current) {
      const sortableTarget = new Sortable(targetBox.current, {
        group: { name: '_target', put: true },
        draggable: '.target-item',
        ghostClass: 'w-[144px]',
        onSort: function ({ item }) {
          if (item.classList.contains('drag-item')) {
            autoReorderTags();
            item.remove();
          } else {
            setTimeout(() => {
              autoReorderTags();
            }, 120);
          }
        },
      });
      return () => {
        sortableTarget.destroy();
      };
    }
  }, [autoReorderTags]);

  return (
    <>
      <div onClick={openModal}>{children}</div>
      <BasicDialog
        className='w-5/6 rounded-lg p-5'
        visible={isOpen}
        hideClose={true}
        onClose={closeModal}
      >
        <div className='ml-auto box-content w-6 pb-4 pl-4' onClick={closeModal}>
          <VscChromeClose size={24} className='cursor-pointer text-gray-500' />
        </div>
        <div className='flex flex-wrap'>
          <div className='w-4/5 pr-2'>
            {portalTagGroups.map((group: PortalTagGroup, index: number) => [
              <div
                key={'group_' + index}
                className='text-lg font-medium text-gray-500'
              >
                {group.groupName}
              </div>,
              <div
                key={'group_items_' + index}
                className='dnd-source-group mb-2 grid grid-cols-7 gap-4 border-b pb-4'
                data-group={group.groupName}
              >
                {group.tags.map((item: PortalTag) => (
                  <GroupItem
                    key={item.tid}
                    item={item}
                    effectedTags={effectedTags}
                    groupName={group.groupName}
                    portalTagGroupsRef={portalTagGroupsRef}
                  />
                ))}
              </div>,
            ])}
          </div>
          <div className='w-1/5 border-l border-b-blue-600 pl-4 dark:border-b-blue-50'>
            <div className='text-lg font-medium text-gray-500'>
              已选（排序）：
            </div>
            <div
              ref={targetBox}
              className='target-box flex h-[440px] flex-col flex-wrap gap-4 overflow-x-auto'
            >
              {effectedTags.map((tid: string, index: number) => {
                const item = portalTagGroups
                  .map((m) => m.tags)
                  .flat()
                  .find((f) => f.tid === tid);
                const itemGroupName = portalTagGroups.find((g) =>
                  g.tags.some((s) => s.tid === tid)
                )?.groupName;
                return (
                  <div
                    key={item?.tid}
                    data-group={itemGroupName}
                    data-tid={item?.tid}
                    className='target-item relative flex w-1/2 rounded-full border border-gray-200 bg-indigo-300 text-white hover:border-blue-500 hover:text-yellow-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:border-blue-500'
                  >
                    <div className='flex w-full flex-wrap border-gray-200 text-center dark:border-gray-600'>
                      <div className='h-6 w-6 rounded-full bg-cyan-700 text-white dark:bg-white dark:text-cyan-700'>
                        {index + 1}
                      </div>
                      <div className='flex-1'>{item?.name}</div>
                    </div>
                    <span
                      className='absolute -right-2 -top-2 h-4 w-4 rounded-full bg-gray-50
                    bg-opacity-70 text-lg leading-none text-orange-600
                    hover:bg-opacity-100 hover:text-red-600 dark:bg-indigo-300 dark:text-orange-200 hover:dark:text-red-600'
                      onClick={() => removeTag(item?.tid)}
                    >
                      ×
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className='mt-4 flex flex-row items-center gap-4 text-sm text-gray-500'>
          <div className='ml-1 font-medium'>
            已选：{total}/{maxTotal}
          </div>
          <FeedbackModal feedbackType={1}>
            <div className='flex w-full cursor-pointer flex-row items-center rounded-lg border border-gray-200 bg-white hover:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:border-blue-500'>
              <div className='w-full border-gray-200 dark:border-gray-600'>
                <div className='flex items-center pl-2'>
                  <IoMdAddCircleOutline size={20} />
                  <span className='ml-2 w-full py-3 text-sm font-medium dark:text-gray-300'>
                    添加标签
                  </span>
                </div>
              </div>
            </div>
          </FeedbackModal>
          <div className='shrink grow' />
          <Button
            variant='primary'
            className='inline-flex w-fit items-center justify-center rounded-lg px-4 py-1.5'
            isLoading={loading}
            onClick={saveTags}
          >
            保存
          </Button>
        </div>
      </BasicDialog>
    </>
  );
}
