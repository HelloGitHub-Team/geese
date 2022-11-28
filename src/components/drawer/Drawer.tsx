import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { AiOutlineClose } from 'react-icons/ai';

type DrawerProps = {
  title: string;
  visible: boolean;
  closable?: boolean;
  destroyOnClose?: boolean; // 关闭时销毁里面的子元素
  getContainer?: HTMLElement | boolean; // 指定 Drawer 挂载的 HTML 节点, false 为挂载在当前 dom
  maskClosable?: boolean; // 点击蒙层是否允许关闭抽屉
  mask?: boolean; // 是否展示遮罩
  drawerStyle?: any; // 用来设置抽屉弹出层样式
  width?: number;
  zIndex?: number;
  placement?: 'top' | 'right' | 'bottom' | 'left'; // 抽屉方向
  children: React.ReactNode;
  onClose: () => void;
};

function Drawer(props: DrawerProps) {
  const {
    closable = true,
    destroyOnClose = true,
    maskClosable = true,
    mask = true,
    drawerStyle = {},
    width = '300px',
    zIndex = 10,
    placement = 'right',
    onClose,
    children,
  } = props;

  const [visible, setVisible] = useState(false);
  // 用于控制子组件的卸载
  const [shouldDestroyChild, setShouldDestroyChild] = useState(false);
  const [container, setContainer] = useState<HTMLElement>();

  useEffect(() => {
    // getContainer 有三种取值: undefined false HTMLElement
    if (props.getContainer === false) {
      setContainer(undefined);
    } else if (props.getContainer === undefined) {
      setContainer(document.body);
    } else if (typeof props.getContainer !== 'boolean') {
      setContainer(props.getContainer);
    }
  }, [props.getContainer]);

  useEffect(() => {
    setVisible(props.visible);
    if (destroyOnClose) {
      setShouldDestroyChild(true);
    }
  }, [props.visible, destroyOnClose]);

  useEffect(() => {
    setVisible(() => {
      if (container && props.visible) {
        container.style.overflow = 'hidden';
      }
      return props.visible;
    });
    setShouldDestroyChild(false);
  }, [props.visible, container]);

  const handleClose = () => {
    onClose && onClose();
    setVisible((prevVisible) => {
      if (container && prevVisible) {
        container.style.overflow = 'auto';
      }
      return false;
    });
    setShouldDestroyChild(false);
  };

  const childDom = (
    // wrap
    <div
      className='top-0 h-full overflow-hidden'
      style={{
        position: container ? 'fixed' : 'absolute',
        width: visible ? '100%' : 0,
        zIndex,
      }}
    >
      {/* mask */}
      {!!mask && (
        <div
          className='absolute inset-0 bg-black bg-opacity-20'
          onClick={maskClosable ? handleClose : undefined}
        ></div>
      )}
      {/* content */}
      <div
        className='absolute top-0 bg-white shadow-md transition-all duration-200'
        style={{
          width: ['top', 'bottom'].includes(placement) ? '100vw' : width,
          height: ['top', 'bottom'].includes(placement) ? width : '100vh',
          top: ['top'].includes(placement) ? 0 : 'auto',
          bottom: ['bottom'].includes(placement) ? 0 : 'auto',
          borderRadius: ['bottom'].includes(placement) ? '8px 8px 0 0' : 0,
          [placement]: visible ? '0' : '-100%',
          ...drawerStyle,
        }}
      >
        {/* 顶部标题和关闭按钮 */}
        <div className='flex h-8 items-center justify-center border-b border-gray-100 py-4 text-center'>
          <div className='font-medium'>{props.title}</div>
          {!!closable && (
            <span
              className='absolute top-2 right-4 cursor-pointer text-black'
              onClick={handleClose}
            >
              <AiOutlineClose style={{ fontSize: 16 }} />
            </span>
          )}
        </div>
        <div className='h-full py-2 px-4'>
          {shouldDestroyChild ? null : children}
        </div>
      </div>
    </div>
  );
  return container ? ReactDOM.createPortal(childDom, container) : childDom;
}

export default Drawer;
