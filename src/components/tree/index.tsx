import React, { useState } from 'react';
import { AiOutlineMinusSquare, AiOutlinePlusSquare } from 'react-icons/ai';

interface ITreeNode {
  name: string;
  children?: ITreeNode[];
}

const TreeNode = ({
  node,
  activeNode,
  onClick,
}: {
  node: ITreeNode;
  activeNode: ITreeNode | null;
  onClick: (node: ITreeNode) => void;
}) => {
  console.log({ activeNode });
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <li style={{ margin: '12px 0' }}>
      <div
        style={{
          cursor: 'default',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {node.children && (
          <div
            onClick={handleToggle}
            style={{ padding: '0 4px', marginRight: 4 }}
          >
            {expanded ? <AiOutlineMinusSquare /> : <AiOutlinePlusSquare />}
          </div>
        )}
        <div
          style={{
            cursor: 'pointer',
            backgroundColor: activeNode?.name === node.name ? 'lightblue' : '',
          }}
          onClick={() => {
            console.log({ node });
            onClick(node);
          }}
        >
          {node.name}
        </div>
      </div>
      {expanded && node.children && (
        <ul style={{ marginLeft: 28 }}>
          {node.children.map((childNode, index) => (
            <TreeNode
              key={index}
              node={childNode}
              activeNode={activeNode}
              onClick={onClick}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

const TreeView = ({ data }: { data: ITreeNode[] }) => {
  const [activeNode, setActiveNode] = useState<ITreeNode | null>(null);

  return (
    <ul style={{ listStyle: 'none' }}>
      {data.map((node, index) => (
        <TreeNode
          key={index}
          node={node}
          activeNode={activeNode}
          onClick={(node) => {
            setActiveNode(node);
            // TODO 点击后跳转页面
          }}
        />
      ))}
    </ul>
  );
};

export default TreeView;
