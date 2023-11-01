import React, { MutableRefObject, useEffect, useRef } from 'react';
import Sortable from 'sortablejs';

import Message from '../message';

import { maxTotal, PortalTag, PortalTagGroup } from '@/types/tag';

interface IProps {
  item: PortalTag;
  effectedTidList: string[];
  groupName: string;
  portalTagGroupsRef: MutableRefObject<PortalTagGroup[]>;
}

const GroupItem = (props: IProps) => {
  const { item, effectedTidList, groupName, portalTagGroupsRef } = props;
  const sortItemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sortItemRef.current) {
      const sortable = new Sortable(sortItemRef.current, {
        group: { name: groupName, pull: 'clone', put: false },
        draggable: '.drag-item',
        filter: '.exist-tag',
        onChoose: function ({ item }) {
          if (effectedTidList.length >= maxTotal) {
            item.draggable = false;
            Message.error(`最多只能选择 ${maxTotal} 个标签`);
            return false;
          }
        },
        sort: false,
      });
      return () => {
        sortable.destroy();
      };
    }
  }, [groupName, portalTagGroupsRef, effectedTidList]);
  return (
    <div
      ref={sortItemRef}
      className={`${
        effectedTidList.includes(item.tid) ? 'exist-tag flex opacity-30' : ''
      }`}
    >
      <div
        key={item.tid}
        data-group={groupName}
        data-tid={item.tid}
        className={
          'drag-item flex w-full flex-row items-center rounded-lg ' +
          'border bg-blue-500 text-white ' +
          `${
            effectedTidList.includes(item.tid)
              ? 'cursor-not-allowed '
              : 'cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 '
          }` +
          'dark:border-gray-600 dark:bg-gray-700 dark:text-white'
        }
      >
        <div className='w-full truncate text-ellipsis border-gray-200 px-0.5 text-center dark:border-gray-600'>
          <label
            htmlFor={item.tid}
            className='text-sm font-medium dark:text-gray-300'
          >
            <span
              className={`${
                effectedTidList.includes(item.tid)
                  ? 'cursor-not-allowed'
                  : 'cursor-pointer'
              }`}
            >
              {item.name}
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default GroupItem;
