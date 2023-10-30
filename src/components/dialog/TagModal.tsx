import { useEffect, useRef, useState } from 'react';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { VscChromeClose } from 'react-icons/vsc';
import Sortable from 'sortablejs';

import { useLoginContext } from '@/hooks/useLoginContext';

import Button from '@/components/buttons/Button';
import { FeedbackModal } from '@/components/dialog/Feedback';
import GroupItem from '@/components/dialog/GroupItem';
import Message from '@/components/message';

import { getSelectTags } from '@/services/tag';

import BasicDialog from '../dialog/BasicDialog';

import { maxTotal, PortalTag, PortalTagGroup } from '@/types/tag';

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
  // useEffect(() => {
  //   portalTagGroupsRef.current = portalTagGroups;
  // }, [portalTagGroups]);

  const targetBox = useRef<HTMLDivElement>(null);

  function closeModal() {
    setIsOpen(false);
    setTotal(0);
  }

  const openModal = async () => {
    if (!isLogin) {
      return login();
    } else {
      const res = await getSelectTags();
      if (res.success) {
        setPortalTagGroups(res.data);
        setEffectedTags(res.effected);
        setIsOpen(true);
      } else {
        Message.error('获取标签失败');
      }
    }
  };

  const autoReorderTags = () => {
    const items = document.querySelectorAll('.target-box > *');
    const tidList = Array.from(items).map(
      (m) => (m as HTMLElement).dataset.tid ?? ''
    );
    setEffectedTags(tidList);
    setTotal(tidList.length);
  };

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

  useEffect(() => {
    setTotal(effectedTags.length);
    if (targetBox.current) {
      const sortableTarget = new Sortable(targetBox.current, {
        group: { name: '_target', put: true },
        draggable: '.target-item',
        onStart: function () {
          console.log('onstart:', total, maxTotal);
          if (total >= maxTotal) {
            Message.error('最多只能选择20个标签');
          }
        },
        ghostClass: 'w-[110px]',
        onSort: function ({ item }) {
          console.log('onsort:', total, maxTotal, item);
          if (total < maxTotal) {
            if (item.classList.contains('drag-item')) {
              autoReorderTags();
              item.remove();
            } else {
              setTimeout(() => {
                autoReorderTags();
              }, 120);
            }
          } else {
            Message.error('最多只能选择20个标签');
          }
        },
      });
      return () => {
        sortableTarget.destroy();
      };
    }
  }, [total, autoReorderTags]);

  return (
    <>
      <div onClick={openModal}>{children}</div>
      <BasicDialog
        className='w-3/5 rounded-lg p-5'
        visible={isOpen}
        hideClose={true}
        onClose={closeModal}
      >
        <div className='ml-auto box-content w-6 pb-1 pl-4' onClick={closeModal}>
          <VscChromeClose size={24} className='cursor-pointer text-gray-500' />
        </div>
        <div className='flex flex-wrap'>
          <div className='w-2/3 pr-3'>
            {portalTagGroups.map((group: PortalTagGroup, index: number) => [
              <div
                key={'group_' + index}
                className='text-lg font-medium text-gray-500'
              >
                {group.group_name}
              </div>,
              <div
                key={'group_items_' + index}
                className='dnd-source-group grid grid-cols-6 gap-3 border-b pt-2.5 pb-4'
                data-group={group.group_name}
              >
                {group.tags.map((item: PortalTag) => (
                  <GroupItem
                    key={item.tid}
                    item={item}
                    effectedTags={effectedTags}
                    groupName={group.group_name}
                    portalTagGroupsRef={portalTagGroupsRef}
                  />
                ))}
              </div>,
            ])}
          </div>
          <div className='w-1/3 border-l border-b-blue-600 pl-3 dark:border-b-blue-50'>
            <div className='text-lg font-medium text-gray-500'>
              已选(拖动排序/点击移除)：
            </div>
            <div
              ref={targetBox}
              className='target-box flex h-[440px] flex-col flex-wrap gap-3 pt-2.5'
            >
              {effectedTags.map((tid: string, index: number) => {
                const item = portalTagGroups
                  .map((m) => m.tags)
                  .flat()
                  .find((f) => f.tid === tid);
                const itemGroupName = portalTagGroups.find((g) =>
                  g.tags.some((s) => s.tid === tid)
                )?.group_name;
                return (
                  <div
                    key={item?.tid}
                    data-group={itemGroupName}
                    data-tid={item?.tid}
                    className='target-item relative flex w-28 rounded-full border border-gray-200 text-white hover:border-blue-500 hover:text-yellow-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:border-blue-500'
                  >
                    <div
                      className='flex w-auto cursor-pointer flex-wrap border-gray-200 dark:border-gray-600'
                      onClick={() => removeTag(item?.tid)}
                    >
                      <div className='h-6 w-6 rounded-full bg-gray-400 text-center text-white dark:bg-white dark:text-cyan-700'>
                        {index + 1}
                      </div>
                      <div className='flex-1 truncate text-ellipsis px-2 text-gray-500'>
                        {item?.name}
                      </div>
                    </div>
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
