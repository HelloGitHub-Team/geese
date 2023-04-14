import { LoginModal } from '../user/Login';

const SideLoginButton = () => {
  return (
    <LoginModal>
      <div className='box-border py-6 text-center align-middle text-base'>
        <button
          type='button'
          className='button box-border rounded-md border-2 border-gray-400 px-3 py-2 text-gray-500 hover:border-blue-500 hover:text-blue-500 dark:text-gray-400'
        >
          立即登录
        </button>
      </div>
    </LoginModal>
  );
};

export default SideLoginButton;
