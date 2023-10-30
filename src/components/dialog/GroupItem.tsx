import React, { MutableRefObject, useEffect, useRef } from 'react';
import Sortable from 'sortablejs';

import { PortalTag, PortalTagGroup } from '@/types/tag';

interface IProps {
  item: PortalTag;
  effectedTags: string[];
  groupName: string;
  portalTagGroupsRef: MutableRefObject<PortalTagGroup[]>;
}

const GroupItem = (props: IProps) => {
  const { item, effectedTags, groupName, portalTagGroupsRef } = props;
  const sortItemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // const sourceElList = document.querySelectorAll('.dnd-source-group');
    // sortableSources.forEach((s) => s.destroy());
    if (sortItemRef.current) {
      const sortable = new Sortable(sortItemRef.current, {
        group: { name: groupName, pull: 'clone', put: false },
        draggable: '.drag-item',
        filter: '.exist-tag',
        sort: false,
      });

      return () => {
        sortable.destroy();
      };
    }
  }, [groupName, portalTagGroupsRef]);
  return (
    <div
      ref={sortItemRef}
      className={`${
        effectedTags.includes(item.tid) ? 'exist-tag flex opacity-25' : ''
      }`}
    >
      <div
        key={item.tid}
        data-group={groupName}
        data-tid={item.tid}
        className='drag-item flex w-full flex-row items-center rounded-lg border border-gray-200 bg-indigo-300 text-white hover:border-blue-500 hover:text-yellow-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:border-blue-500'
      >
        <div className='w-full border-gray-200 dark:border-gray-600'>
          <label
            htmlFor={item.tid}
            className='w-full truncate text-ellipsis py-3 pl-2 text-sm font-medium dark:text-gray-300'
          >
            {item.name}
          </label>
        </div>
      </div>
    </div>
  );
};

export default GroupItem;
