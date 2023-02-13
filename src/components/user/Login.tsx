import { render } from 'react-dom';
import { VscChromeClose } from 'react-icons/vsc';

import BasicDialog from '@/components/dialog/BasicDialog';

import { GitHubButton, WechatButton } from '../buttons/LoginButton';
import CustomLink from '../links/CustomLink';

export function LoginModal({ children }: { children: JSX.Element }) {
  let div: HTMLDivElement;
  function closeModal() {
    document.body.removeChild(div);
  }

  function openModal() {
    div = document.createElement('div');
    render(LoginDialog, div);
    document.body.appendChild(div);
  }

  const LoginDialog = (
    <BasicDialog
      className='max-w-xs rounded-lg p-5'
      visible
      hideClose
      onClose={closeModal}
    >
      <div
        className='mb-4 flex flex-row justify-between border-b pb-2 '
        onClick={closeModal}
      >
        <div className='font-medium '>选择登录方式</div>
        <div>
          <VscChromeClose size={18} className='cursor-pointer text-gray-500' />
        </div>
      </div>
      <div className='mx-auto px-10'>
        <div className='flex flex-col gap-3'>
          <GitHubButton />
          <WechatButton />
        </div>

        <div className='mt-4 flex flex-row px-1 text-xs text-gray-500'>
          登录即表示同意
          <CustomLink className='inline' href='/help/ats'>
            <span className='ml-1 cursor-pointer text-blue-500'>服务协议</span>
          </CustomLink>
        </div>
      </div>
    </BasicDialog>
  );

  return <div onClick={openModal}>{children}</div>;
}
