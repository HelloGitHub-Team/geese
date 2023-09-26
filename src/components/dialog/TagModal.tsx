import { useEffect, useState } from 'react';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { VscChromeClose } from 'react-icons/vsc';
import Sortable from 'sortablejs';

import { useLoginContext } from '@/hooks/useLoginContext';

import Button from '@/components/buttons/Button';
import { FeedbackModal } from '@/components/dialog/Feedback';

import { getEffectedTags, getPortalTagGroups } from '@/services/tag';

import BasicDialog from '../dialog/BasicDialog';

import { PortalTag, PortalTagGroup } from '@/types/tag';

const maxTotal = 20;
const defaultTag = { name: '综合', tid: '', icon_name: 'find' };

export function TagModal({
  children,
  updateTags,
}: {
  children: JSX.Element;
  updateTags: any;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState(0);
  const { isLogin, login } = useLoginContext();
  const [portalTagGroups, setPortalTagGroups] = useState<PortalTagGroup[]>([]);
  const [effectedTags, setEffectedTags] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  let sortableSources: Sortable[] = [];
  let sortableTarget: Sortable | undefined = undefined;
  let tempDraggedItem: PortalTag | undefined = undefined;
  let tempGroup: string | undefined = undefined;

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
  const autoReorderTags = () => {
    const items = document.querySelectorAll('.target-box > *');
    const tidList = Array.from(items).map(
      (m) => (m as HTMLElement).dataset.tid ?? ''
    );
    setEffectedTags(tidList);
    console.log(' log -：57 effectedTags', effectedTags);
  };
  const initDND = () => {
    const sourceElList = document.querySelectorAll('.dnd-source-group');
    const targetBox = document.querySelector('.target-box');
    sortableSources.forEach((s) => s.destroy());
    sortableTarget?.destroy();
    if (portalTagGroups.length > 0) {
      sortableSources = portalTagGroups.map(
        (g, index) =>
          new Sortable(sourceElList[index] as HTMLElement, {
            group: { name: g.groupName, pull: 'clone', put: false },
            draggable: '.drag-item',
            filter: '.exist-tag',
            sort: false,
            setData: function (dataTransfer, draggedElement) {
              tempDraggedItem = portalTagGroups
                .map((m) => m.tags)
                .flat()
                .find((f) => f.tid === draggedElement.dataset.tid);
              tempGroup = draggedElement.dataset.group;
            },
          })
      );
    }
    if (targetBox) {
      sortableTarget = new Sortable(targetBox as HTMLElement, {
        group: { name: '_target', put: true },
        draggable: '.target-item',
        setData: function (dataTransfer, draggedElement) {
          tempDraggedItem = portalTagGroups
            .map((m) => m.tags)
            .flat()
            .find((f) => f.tid === draggedElement.dataset.tid);
          tempGroup = draggedElement.dataset.group;
        },
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
    }

    // const sortableEntity = document.getElementById('sortable')
  };
  const saveTags = async () => {
    /*const tids = []
    const selectTags = []
    for (let i = 0; i < allTags.length; i++) {
      if (allTags[i].is_selected) {
        tids.push(allTags[i].tid)
        selectTags.push(allTags[i])
      }
    }
    selectTags.unshift(defaultTag)
    setLoading(true)
    const res = await saveSelectTags(tids)
    if (res.success) {
      Message.success('保存成功！')
      updateTags(selectTags)
      setIsOpen(false)
    } else {
      Message.error(('保存失败：' + res?.message) as string)
    }
    setLoading(false)*/
  };

  const fetchPortalTagGroups = async () => {
    const portalTagGroups = await getPortalTagGroups();
    setPortalTagGroups(portalTagGroups);
  };
  useEffect(() => {
    fetchPortalTagGroups();
  }, []);

  useEffect(() => {
    initDND();
  }, [effectedTags]);

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
                  <div
                    key={item.tid}
                    data-group={group.groupName}
                    data-tid={item.tid}
                    className={`${
                      effectedTags.includes(item.tid)
                        ? 'exist-tag opacity-25'
                        : ''
                    } drag-item flex w-full flex-row items-center rounded-lg border border-gray-200 bg-indigo-300 text-white hover:border-blue-500 hover:text-yellow-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:border-blue-500`}
                  >
                    <div className='w-full border-gray-200 dark:border-gray-600'>
                      <label
                        htmlFor={item.tid}
                        className='ml-2 w-full py-3 text-sm font-medium dark:text-gray-300'
                      >
                        {item.name}
                      </label>
                    </div>
                  </div>
                ))}
              </div>,
            ])}
          </div>
          <div className='w-1/5 border-l border-b-blue-600 pl-4 dark:border-b-blue-50'>
            <div className='text-lg font-medium text-gray-500'>
              已选（排序）：
            </div>
            <div className='target-box flex h-[500px] flex-col gap-4'>
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
                    className='target-item flex w-1/2 rounded-full border border-gray-200 bg-indigo-300 text-white hover:border-blue-500 hover:text-yellow-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:border-blue-500'
                  >
                    <div className='flex w-full flex-wrap border-gray-200 text-center dark:border-gray-600'>
                      <div className='h-6 w-6 rounded-full bg-cyan-700 text-white dark:bg-white dark:text-cyan-700'>
                        {index + 1}
                      </div>
                      <div className='flex-1'>{item?.name}</div>
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
          <div className='shrink grow' />

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
