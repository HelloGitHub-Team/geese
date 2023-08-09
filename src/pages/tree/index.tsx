import React from 'react';

import TreeView from '@/components/tree';

export default function index() {
  const treeData = [
    {
      name: 'Python教程',
      children: [
        {
          name: 'Python简介',
        },
        { name: 'Python安装', children: [{ name: 'Python解释器' }] },
        {
          name: '第一个Python程序',
          children: [
            { name: '使用文本编辑器' },
            { name: 'Python代码运行助手' },
            { name: '输入和输出' },
          ],
        },
      ],
    },
  ];
  return (
    <div style={{ border: '1px solid', width: 300 }}>
      <TreeView data={treeData} />
    </div>
  );
}
